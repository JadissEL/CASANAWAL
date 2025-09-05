// Système de monitoring d'erreurs autonome
interface ErrorReport {
  timestamp: string;
  error: string;
  stack?: string;
  url: string;
  userAgent: string;
  component?: string;
}

class ErrorMonitor {
  private errors: ErrorReport[] = [];
  private maxErrors = 100;

  constructor() {
    if ((import.meta as any).env?.DEV) return; // Skip wiring in dev
    this.setupGlobalErrorHandlers();
    this.setupReactErrorBoundary();
  }

  private setupGlobalErrorHandlers() {
    // Capture les erreurs JavaScript globales
    window.addEventListener('error', (event) => {
      this.captureError({
        timestamp: new Date().toISOString(),
        error: event.error?.message || event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // Capture les erreurs de promesses non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        timestamp: new Date().toISOString(),
        error: `Unhandled Promise Rejection: ${event.reason}`,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // Capture les erreurs console
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.captureError({
        timestamp: new Date().toISOString(),
        error: args.join(' '),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      originalConsoleError.apply(console, args);
    };
  }

  private setupReactErrorBoundary() {
    // Hook pour React Error Boundary
    (window as any).__REACT_ERROR_MONITOR__ = (error: Error, componentStack: string) => {
      this.captureError({
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        component: componentStack
      });
    };
  }

  private captureError(errorReport: ErrorReport) {
    this.errors.unshift(errorReport);

    // Garder seulement les dernières erreurs
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Envoyer au backend pour debug autonome (skip in dev to avoid noise)
    if (!(import.meta as any).env?.DEV) {
      this.sendToBackend(errorReport);
    }

    // Afficher dans la console custom
    this.displayInCustomConsole(errorReport);
  }

  private async sendToBackend(errorReport: ErrorReport) {
    try {
      await fetch('/api/debug/error-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      });
    } catch (e) {
      // Erreur silencieuse pour éviter les boucles
    }
  }

  private displayInCustomConsole(errorReport: ErrorReport) {
    // Afficher dans notre console custom
    const consoleElement = document.getElementById('custom-debug-console');
    if (consoleElement) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-entry';
      errorDiv.innerHTML = `
        <div class="error-timestamp">${errorReport.timestamp}</div>
        <div class="error-message">${errorReport.error}</div>
        ${errorReport.stack ? `<div class="error-stack">${errorReport.stack}</div>` : ''}
      `;
      consoleElement.appendChild(errorDiv);
      consoleElement.scrollTop = consoleElement.scrollHeight;
    }
  }

  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  public clearErrors() {
    this.errors = [];
    const consoleElement = document.getElementById('custom-debug-console');
    if (consoleElement) {
      consoleElement.innerHTML = '';
    }
  }

  public exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }
}

// Instance globale (no-op in dev)
export const errorMonitor = new ErrorMonitor();

// Initialiser automatiquement en production uniquement
if (typeof window !== 'undefined' && !(import.meta as any).env?.DEV) {
  (window as any).__ERROR_MONITOR__ = errorMonitor;
}

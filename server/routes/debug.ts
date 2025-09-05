import { RequestHandler } from "express";

interface ErrorReport {
  timestamp: string;
  error: string;
  stack?: string;
  url: string;
  userAgent: string;
  component?: string;
}

// Store des erreurs en mémoire (en production, utilisez une vraie DB)
const errorReports: ErrorReport[] = [];
const MAX_ERRORS = 1000;

export const reportError: RequestHandler = (req, res) => {
  try {
    const errorReport: ErrorReport = req.body;
    
    // Ajouter l'erreur au store
    errorReports.unshift(errorReport);
    
    // Garder seulement les dernières erreurs
    if (errorReports.length > MAX_ERRORS) {
      errorReports.splice(MAX_ERRORS);
    }
    
    // Log pour le debug autonome
    console.log('🐛 [ERROR CAPTURED]', {
      timestamp: errorReport.timestamp,
      error: errorReport.error,
      url: errorReport.url,
      component: errorReport.component
    });
    
    // Auto-analyse et suggestions
    analyzeError(errorReport);
    
    res.json({ success: true, message: 'Error reported successfully' });
  } catch (error) {
    console.error('Error in reportError:', error);
    res.status(500).json({ success: false, error: 'Failed to report error' });
  }
};

export const getErrors: RequestHandler = (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const recentErrors = errorReports.slice(0, limit);
    
    res.json({
      success: true,
      data: recentErrors,
      total: errorReports.length
    });
  } catch (error) {
    console.error('Error in getErrors:', error);
    res.status(500).json({ success: false, error: 'Failed to get errors' });
  }
};

export const clearErrors: RequestHandler = (req, res) => {
  try {
    errorReports.length = 0;
    console.log('🧹 Error reports cleared');
    
    res.json({ success: true, message: 'Errors cleared successfully' });
  } catch (error) {
    console.error('Error in clearErrors:', error);
    res.status(500).json({ success: false, error: 'Failed to clear errors' });
  }
};

// Auto-analyse des erreurs
function analyzeError(errorReport: ErrorReport) {
  const suggestions: string[] = [];
  
  // Analyse des patterns d'erreur communs
  if (errorReport.error.includes('Unterminated string')) {
    suggestions.push('❌ ERREUR: Chaîne de caractères non fermée - vérifiez les guillemets');
  }
  
  if (errorReport.error.includes('Expected')) {
    suggestions.push('❌ ERREUR: Syntaxe JavaScript incorrecte - vérifiez les accolades/parenthèses');
  }
  
  if (errorReport.error.includes('Cannot find module')) {
    suggestions.push('❌ ERREUR: Module manquant - vérifiez les imports');
  }
  
  if (errorReport.error.includes('fetch')) {
    suggestions.push('❌ ERREUR: Problème API - vérifiez la connexion backend');
  }
  
  if (suggestions.length > 0) {
    console.log('💡 [AUTO-SUGGESTIONS]');
    suggestions.forEach(suggestion => console.log('  ', suggestion));
  }
}

// Statistiques d'erreurs
export const getErrorStats: RequestHandler = (req, res) => {
  try {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentErrors = errorReports.filter(e => new Date(e.timestamp) > lastHour);
    const dailyErrors = errorReports.filter(e => new Date(e.timestamp) > last24Hours);
    
    // Grouper par type d'erreur
    const errorTypes = errorReports.reduce((acc, error) => {
      const type = error.error.split(':')[0] || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    res.json({
      success: true,
      data: {
        total: errorReports.length,
        lastHour: recentErrors.length,
        last24Hours: dailyErrors.length,
        errorTypes,
        mostRecent: errorReports[0] || null
      }
    });
  } catch (error) {
    console.error('Error in getErrorStats:', error);
    res.status(500).json({ success: false, error: 'Failed to get error stats' });
  }
};

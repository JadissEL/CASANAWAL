import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { X, Download, Trash2, RefreshCw } from 'lucide-react';
import { errorMonitor } from '@/lib/error-monitor';

interface DebugConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DebugConsole({ isOpen, onClose }: DebugConsoleProps) {
  const [errors, setErrors] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isOpen && autoRefresh) {
      const interval = setInterval(() => {
        setErrors(errorMonitor.getErrors());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, autoRefresh]);

  useEffect(() => {
    if (isOpen) {
      setErrors(errorMonitor.getErrors());
    }
  }, [isOpen]);

  const handleClearErrors = () => {
    errorMonitor.clearErrors();
    setErrors([]);
  };

  const handleExportErrors = () => {
    const errorData = errorMonitor.exportErrors();
    const blob = new Blob([errorData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `errors-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setErrors(errorMonitor.getErrors());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            🔍 Console de Debug Autonome
            <Badge variant="secondary">{errors.length} erreurs</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Actualiser
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportErrors}>
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearErrors}>
              <Trash2 className="h-4 w-4" />
              Vider
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div 
            id="custom-debug-console"
            className="h-full overflow-y-auto bg-gray-900 text-green-400 p-4 rounded font-mono text-sm"
          >
            {errors.length === 0 ? (
              <div className="text-gray-500 text-center mt-8">
                Aucune erreur détectée. Le monitoring est actif.
              </div>
            ) : (
              errors.map((error, index) => (
                <div key={index} className="mb-4 border-b border-gray-700 pb-2">
                  <div className="text-red-400 font-bold">
                    [{new Date(error.timestamp).toLocaleTimeString()}] ERREUR
                  </div>
                  <div className="text-white mt-1">{error.error}</div>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-yellow-400 cursor-pointer">
                        Stack trace
                      </summary>
                      <pre className="text-gray-300 text-xs mt-1 whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                  {error.component && (
                    <div className="text-blue-400 text-xs mt-1">
                      Component: {error.component}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

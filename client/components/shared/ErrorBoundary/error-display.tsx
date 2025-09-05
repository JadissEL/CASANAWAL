import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ErrorDisplayProps } from './types';

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  variant = 'card',
}) => {
  const errorContent = (
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">
          Une erreur est survenue
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {error.message || 'Une erreur inattendue s\'est produite'}
        </p>
        {(onRetry || onDismiss) && (
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                <RefreshCw className="mr-1 h-3 w-3" />
                Réessayer
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Fermer
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  switch (variant) {
    case 'inline':
      return (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          {errorContent}
        </div>
      );

    case 'alert':
      return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          {errorContent}
        </div>
      );

    case 'card':
    default:
      return (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-4">
            {errorContent}
          </CardContent>
        </Card>
      );
  }
};

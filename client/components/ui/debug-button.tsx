import React, { useState } from 'react';
import { Button } from './button';
import { DebugConsole } from './debug-console';
import { Bug } from 'lucide-react';

export function DebugButton() {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Ne pas afficher en production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsConsoleOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-red-600 hover:bg-red-700 text-white"
        size="sm"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug ({(window as any).__ERROR_MONITOR__?.getErrors()?.length || 0})
      </Button>
      
      <DebugConsole 
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
      />
    </>
  );
}

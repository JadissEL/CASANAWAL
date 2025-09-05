// Async error boundary for async operations
export function withAsyncErrorBoundary<T extends any[], R>(
  asyncFunction: (...args: T) => Promise<R>,
  errorHandler?: (error: Error) => void
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      console.error('Async error caught:', errorObj);

      if (errorHandler) {
        errorHandler(errorObj);
      }

      return null;
    }
  };
}

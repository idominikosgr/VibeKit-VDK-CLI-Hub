'use client';

import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { errorLogger } from '@/lib/error-handling';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    errorLogger.log(error, `ErrorBoundary: ${errorInfo.componentStack}`);
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          reset={this.reset}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  reset: () => void;
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps): JSX.Element {
  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <Alert variant="destructive" className="my-8">
      <Icons.alertTriangle className="h-5 w-5" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleReset}>
            Try again
          </Button>
          <Button size="sm" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export const ErrorBoundary = ErrorBoundaryClass;

export function GlobalErrorHandler() {
  useEffect(() => {
    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      errorLogger.log(event.reason, 'Unhandled Promise Rejection');
    }

    function handleError(event: ErrorEvent) {
      errorLogger.log(event.error || event.message, 'Global Error');
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}

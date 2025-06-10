import React from 'react';
import { toast } from 'sonner';

// Error types
export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: any;
};

// Error logging service
export const errorLogger = {
  log: (error: unknown, context?: string) => {
    // Log to console during development
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);

    // In production, we could send to a monitoring service like Sentry
    // if (process.env.NODE_ENV === 'production') {
    //   captureException(error);
    // }
  }
};

// Format error for display
export function formatError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = error as Partial<ApiError>;
    if (apiError.message) {
      return apiError.message;
    }
  }

  return 'An unexpected error occurred';
}

// Helper to show error toast
export function showErrorToast(error: unknown, fallbackMessage = 'An unexpected error occurred') {
  const message = formatError(error) || fallbackMessage;
  toast.error(message);
}

// Helper to handle API errors
export async function handleApiRequest<T>(
  requestFn: () => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
    context?: string;
    errorMessage?: string;
  } = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await requestFn();

    if (options.onSuccess) {
      options.onSuccess(data);
    }

    return { data, error: null };
  } catch (error) {
    errorLogger.log(error, options.context);

    const errorMessage = options.errorMessage || formatError(error);

    if (options.onError) {
      options.onError(error);
    } else {
      showErrorToast(error, errorMessage);
    }

    return { data: null, error: errorMessage };
  }
}

// ErrorBoundary HOC for React components
export function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error: Error; reset: () => void }>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  // Return the error boundary as a function to be used when .tsx support is added
  // Currently this file has .ts extension which doesn't support JSX
  return function WrappedComponent(props: P) {
    // This is a placeholder that will need to be implemented in a .tsx file
    return null;
  };
}

// To properly use JSX, create a new file named error-boundary.tsx
// and implement the full error boundary component there

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { errorLogger } from '@/lib/error-handling';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our monitoring system
    errorLogger.log(error, 'Global Error');
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-4xl font-bold tracking-tighter">Something went wrong!</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We apologize for the inconvenience. Our team has been notified of this issue.
            </p>
            <div className="mt-6">
              <Button onClick={() => reset()} variant="default">
                Try again
              </Button>
              <Button
                className="ml-2"
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                Return to home
              </Button>
            </div>
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-8 rounded-md bg-destructive/10 p-4 text-left">
                <p className="font-mono text-sm text-destructive">{error.message}</p>
                <p className="mt-2 font-mono text-sm text-muted-foreground">
                  {error.stack}
                </p>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { errorLogger } from '@/lib/error-handling';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our monitoring system
    errorLogger.log(error, 'Page Error');
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="mt-4 text-muted-foreground">
        We apologize for the inconvenience. Please try again.
      </p>
      <div className="mt-6">
        <Button onClick={() => reset()}>Try again</Button>
      </div>

      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-8 max-w-md rounded-md bg-destructive/10 p-4 text-left">
          <p className="font-mono text-sm text-destructive">{error.message}</p>
        </div>
      )}
    </div>
  );
}

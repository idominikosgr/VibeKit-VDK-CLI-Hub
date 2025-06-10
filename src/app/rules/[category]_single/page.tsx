'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

// Redirector for direct category/rule ID access
// Uses the 'category' parameter name to avoid Next.js routing conflicts
export default function CategoryOrRuleRedirector({ params }: { params: Promise<{ category: string }> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleRedirect() {
      try {
        const unwrappedParams = await params;
        const id = unwrappedParams.category;
        
        if (!id) {
          throw new Error('ID is missing');
        }

        console.log(`Processing direct ID route: ${id}`);
        
        // Check if the ID is a UUID - if so, it might be a category ID
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUuid = uuidPattern.test(id);
        
        if (isUuid) {
          console.log(`ID ${id} appears to be a UUID, checking if it's a category`);
          
          // Use the debug API to check what type of ID this is
          const debugResponse = await fetch(`/api/rules/debug?ruleId=${encodeURIComponent(id)}`);
          const debugData = await debugResponse.json();
          
          if (debugData.idType === 'CATEGORY_UUID') {
            console.log(`Confirmed ${id} is a category UUID: ${debugData.categoryMatch?.name}`);
            // This is a category ID, redirect to the category page
            window.location.href = `/rules/${id}`;
            return;
          }
        }
        
        // Default case: treat as a rule ID and redirect to rule redirector
        console.log(`Redirecting to rule lookup: ${id}`);
        window.location.href = `/rules/r/${id}`;
      } catch (err) {
        console.error('Rule redirector error:', err);
        setError(err instanceof Error ? err.message : 'Failed to process the redirect');
        setIsLoading(false);
      }
    }
    
    handleRedirect();
  }, [params, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="mt-4 text-lg font-medium">Redirecting...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
        <div className="p-6 bg-muted rounded-lg shadow-sm">
          <Icons.alertTriangle className="mx-auto h-12 w-12 text-destructive opacity-80" />
          <h1 className="text-xl font-bold mb-4">Not Found</h1>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => router.push('/rules')}>
              View All Rules
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // This should never be rendered as we always redirect or show error
  return null;
} 
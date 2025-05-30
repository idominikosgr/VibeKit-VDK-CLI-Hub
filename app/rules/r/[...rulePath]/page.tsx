'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';

interface RuleRedirectPageProps {
  params: Promise<{
    rulePath: string[];
  }>
}

export default function RuleRedirectPage({ params }: RuleRedirectPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function lookupAndRedirect() {
      try {
        // Unwrap params for Next.js 15+
        const unwrappedParams = await params;
        const rulePath = unwrappedParams.rulePath;

        if (!rulePath || rulePath.length === 0) {
          setError('Invalid rule path');
          setIsLoading(false);
          return;
        }

        // Create the path to look up
        const pathSegments = rulePath.join('/');
        console.log(`Looking up rule by path: ${pathSegments}`);
        
        // Call the API to find the rule and get redirect info
        const response = await fetch(`/api/rules/r/${pathSegments}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError(`Rule not found: ${pathSegments}`);
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to find rule');
          }
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        
        if (data.redirect) {
          // Redirect to the canonical rule URL
          router.push(data.redirect);
        } else {
          setError('Invalid redirect information received');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error during rule redirect:', error);
        setError('Failed to process rule lookup');
        setIsLoading(false);
      }
    }
    
    lookupAndRedirect();
  }, [params, router]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-12 w-12 animate-spin text-primary/70" />
          <h2 className="mt-4 text-xl font-medium">Finding Rule...</h2>
          <p className="mt-2 text-muted-foreground">We&apos;re locating the requested rule.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Icons.alertTriangle className="mx-auto h-12 w-12 text-destructive opacity-80" />
          <h2 className="mt-4 text-xl font-medium">Rule Not Found</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <button 
            className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            onClick={() => router.push('/rules')}
          >
            Browse All Rules
          </button>
        </div>
      </div>
    );
  }

  // This should never be seen as we either redirect or show error/loading state
  return null;
} 
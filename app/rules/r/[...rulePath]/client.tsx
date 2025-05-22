'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

// Client-side implementation to handle rule redirects
export default function RuleRedirectClient({ ruleId }: { ruleId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleRedirect() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Clean up the ruleId if it's a file path
        let cleanedRuleId = ruleId;
        
        // Handle paths and file extensions
        if (ruleId.includes('/')) {
          // For paths, extract the last segment (likely the actual rule ID)
          const segments = ruleId.split('/');
          const lastSegment = segments[segments.length - 1];
          // Remove extension if present
          cleanedRuleId = lastSegment.replace(/\.mdc$/, '');
          console.log(`Extracted rule ID from path: ${cleanedRuleId}`);
        } else if (ruleId.endsWith('.mdc')) {
          // Remove .mdc extension if present
          cleanedRuleId = ruleId.replace(/\.mdc$/, '');
          console.log(`Removed extension from rule ID: ${cleanedRuleId}`);
        }
        
        console.log(`Looking up rule: ${cleanedRuleId}`);
        
        // Check if cleanedRuleId looks like a UUID - if so, it's likely a category ID
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (uuidPattern.test(cleanedRuleId)) {
          console.log(`ID ${cleanedRuleId} appears to be a UUID, treating as a category ID`);
          
          // Verify if this UUID is actually a valid category before redirecting
          try {
            // Check if the category exists by making a call to the debug API
            const debugResponse = await fetch(`/api/rules/debug?ruleId=${encodeURIComponent(cleanedRuleId)}`);
            const debugData = await debugResponse.json();
            
            if (debugData.categoryMatch) {
              console.log(`Confirmed UUID ${cleanedRuleId} is a category: ${debugData.categoryMatch.name}`);
              
              // Use direct window location change for more reliable redirection
              const categoryUrl = `/rules/${cleanedRuleId}`;
              console.log(`Redirecting directly to category: ${categoryUrl}`);
              
              // Force a hard navigation to the category page
              window.location.href = categoryUrl;
              return;
            } else {
              console.log(`UUID ${cleanedRuleId} does not match any category, proceeding with rule lookup`);
              // Fall through to rule lookup
            }
          } catch (err) {
            console.warn(`Error verifying category UUID, proceeding with rule lookup:`, err);
            // Fall through to rule lookup if verification fails
          }
        }
        
        // Use the dedicated rule lookup endpoint
        const lookupResponse = await fetch(`/api/rules/r/${encodeURIComponent(cleanedRuleId)}`);
        
        if (!lookupResponse.ok) {
          if (lookupResponse.status === 404) {
            console.error(`Rule not found: ${cleanedRuleId}`);
            throw new Error(`Rule not found with ID: ${cleanedRuleId}. Please check that this rule exists.`);
          }
          throw new Error(`Error looking up rule: ${lookupResponse.statusText}`);
        }
        
        const data = await lookupResponse.json();
        if (!data || !data.redirect) {
          throw new Error(`Invalid response from server when looking up rule ID: ${cleanedRuleId}`);
        }
        
        // Redirect to the proper rule page - use direct navigation for reliability
        console.log(`Redirecting to: ${data.redirect}`);
        window.location.href = data.redirect;
      } catch (err) {
        console.error('Rule redirect error:', err);
        setError(err instanceof Error ? err.message : 'Failed to process the rule redirect');
        setIsLoading(false);
      }
    }
    
    if (ruleId) {
      handleRedirect();
    } else {
      setError('Rule ID is missing. Please check the URL.');
      setIsLoading(false);
    }
  }, [ruleId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="mt-4 text-lg font-medium">Loading rule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
        <div className="p-6 bg-muted rounded-lg shadow-sm">
          <Icons.alertTriangle className="mx-auto h-12 w-12 text-destructive opacity-80" />
          <h1 className="text-xl font-bold mb-4">Rule Not Found</h1>
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

  // This should never be rendered as we always redirect or show error,
  // but provides a fallback if redirection is in progress
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      <p className="ml-2">Redirecting...</p>
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { RuleModal } from '@/components/rules/rule-modal';
import { Rule } from '@/lib/types';
import { getRule } from '@/lib/actions/rule-actions';
import { AlertCircle } from 'lucide-react';

// Define the rule page props
interface RulePageProps {
  params: {
    category: string;
    ruleId: string;
  };
}

export default function RulePage({ params }: RulePageProps) {
  const router = useRouter();
  const [rule, setRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadRule() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the rule using the server action
        const response = await getRule(params.ruleId);
        
        if (!response.success) {
          setError(response.error || 'Failed to load rule');
          setLoading(false);
          return;
        }
        
        if (!response.data) {
          setError('Rule not found');
          setLoading(false);
          return;
        }
        
        setRule(response.data);
      } catch (err) {
        console.error('Error loading rule:', err);
        setError('An unexpected error occurred while loading the rule');
      } finally {
        setLoading(false);
      }
    }
    
    loadRule();
  }, [params.ruleId]);

  // Format the last updated date if available
  const formattedDate = rule?.last_updated 
    ? new Date(rule.last_updated).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Unknown';

  // Handle the rule modal open state
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Show loading state while fetching the rule
  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link href="/rules" className="hover:text-foreground">Rules</Link>
          <span>/</span>
          <Link href={`/rules/${params.category}`} className="hover:text-foreground">
            {params.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">Loading...</span>
        </div>
        
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-3/4 bg-muted rounded"></div>
          <div className="h-6 w-1/2 bg-muted rounded"></div>
          <div className="h-64 w-full bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !rule) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link href="/rules" className="hover:text-foreground">Rules</Link>
          <span>/</span>
          <Link href={`/rules/${params.category}`} className="hover:text-foreground">
            {params.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">Error</span>
        </div>
        
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {error || 'Rule not found'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error === 'Rule not found'
              ? 'The requested rule could not be found.'
              : 'There was a problem loading this rule.'}
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button asChild>
              <Link href="/rules">Browse All Rules</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/rules" className="hover:text-foreground">Rules</Link>
          <span>/</span>
          <Link href={`/rules/${params.category}`} className="hover:text-foreground">
            {params.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{rule.title}</span>
        </div>
        
        {/* Rule title and description */}
        <div>
          <h1 className="text-3xl font-bold">{rule.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{rule.description}</p>
          
          {rule.tags && rule.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {rule.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Rule Content</CardTitle>
                <CardDescription>
                  Read the full rule content or view it in a larger modal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none border rounded-md p-4 bg-muted/30 overflow-auto max-h-[500px]">
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {rule.content.length > 1000 
                      ? `${rule.content.substring(0, 1000)}...`
                      : rule.content}
                  </div>
                  
                  {rule.content.length > 1000 && (
                    <div className="mt-4 text-center">
                      <Button onClick={handleOpenModal}>View Full Content</Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" onClick={handleOpenModal} className="w-full">
                  <Icons.expand className="h-4 w-4 mr-2" />
                  Open in Modal
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rule Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Version</dt>
                    <dd>{rule.version}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                    <dd>{formattedDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Downloads</dt>
                    <dd>{rule.downloads} {rule.downloads === 1 ? 'download' : 'downloads'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                    <dd className="flex items-center gap-1">
                      <span>{rule.categoryName || params.category}</span>
                    </dd>
                  </div>
                  {rule.author && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Author</dt>
                      <dd>{rule.author}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icons.download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icons.copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icons.thumbsUp className="h-4 w-4 mr-1" />
                    Vote
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {rule.compatibility && Object.values(rule.compatibility).some(arr => arr && arr.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Compatibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rule.compatibility.frameworks && rule.compatibility.frameworks.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Frameworks</h3>
                      <div className="flex flex-wrap gap-2">
                        {rule.compatibility.frameworks.map((framework: string) => (
                          <Badge key={framework} variant="outline">{framework}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {rule.compatibility.ides && rule.compatibility.ides.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">IDEs</h3>
                      <div className="flex flex-wrap gap-2">
                        {rule.compatibility.ides.map((ide: string) => (
                          <Badge key={ide} variant="outline">{ide}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {rule.compatibility.aiAssistants && rule.compatibility.aiAssistants.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">AI Assistants</h3>
                      <div className="flex flex-wrap gap-2">
                        {rule.compatibility.aiAssistants.map((assistant: string) => (
                          <Badge key={assistant} variant="outline">{assistant}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Rule modal */}
      <RuleModal
        rule={rule}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

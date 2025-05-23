import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clipboard, Download, ThumbsUp, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Rule } from '@/lib/types';
import { toast } from 'sonner';
import { incrementRuleDownloads } from '@/lib/services/supabase-rule-service';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Dynamic import for react-markdown to avoid SSR issues
import dynamic from 'next/dynamic';

const Markdown = dynamic(() => import('react-markdown'), {
  ssr: false,
  loading: () => <p className="text-muted-foreground">Loading content...</p>
});

interface RuleModalProps {
  rule: Rule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to safely get examples entries
function getSafeExamples(examples: any): [string, any][] {
  if (!examples || typeof examples !== 'object') {
    return [];
  }
  
  try {
    return Object.entries(examples).filter(([key, value]) => 
      typeof key === 'string' && key.length > 0
    );
  } catch (e) {
    console.warn('Error processing examples:', e);
    return [];
  }
}

// Helper function to safely check compatibility arrays
function hasCompatibilityData(compatibility: any): boolean {
  if (!compatibility || typeof compatibility !== 'object') {
    return false;
  }
  
  return Object.values(compatibility).some(arr => 
    Array.isArray(arr) && arr.length > 0
  );
}

// Safe content renderer with fallback
function SafeContentRenderer({ content }: { content: string }) {
  const [renderError, setRenderError] = useState(false);
  
  if (!content) {
    return <p className="text-muted-foreground italic">No content available for this rule.</p>;
  }

  if (renderError) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Markdown rendering failed. Showing raw content:</p>
        <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md overflow-auto max-h-96">
          {content}
        </pre>
      </div>
    );
  }

  try {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <Markdown
          components={{
            // Safe rendering of code blocks
            code: ({ children, ...props }) => (
              <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            ),
            pre: ({ children, ...props }) => (
              <pre className="bg-muted p-4 rounded-md overflow-auto" {...props}>
                {children}
              </pre>
            ),
          }}
        >
          {content}
        </Markdown>
      </div>
    );
  } catch (error) {
    console.error('Markdown rendering error:', error);
    setRenderError(true);
    return (
      <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md overflow-auto max-h-96">
        {content}
      </pre>
    );
  }
}

export function RuleModal({ rule, open, onOpenChange }: RuleModalProps) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [downloading, setDownloading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  // Early return if no rule
  if (!rule) {
    return null;
  }

  // Safely access rule properties
  const safeRule = {
    ...rule,
    title: rule.title || 'Untitled Rule',
    description: rule.description || 'No description available',
    content: rule.content || '',
    tags: Array.isArray(rule.tags) ? rule.tags : [],
    votes: typeof rule.votes === 'number' ? rule.votes : 0,
    downloads: typeof rule.downloads === 'number' ? rule.downloads : 0,
    version: rule.version || '1.0.0',
    categoryName: rule.categoryName || 'Unknown Category'
  };

  // Format the date for display
  const formattedDate = rule.last_updated 
    ? new Date(rule.last_updated).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Unknown';

  // Safely get examples data
  const safeExamples = getSafeExamples(rule.examples);
  const hasExamples = safeExamples.length > 0;

  // Safely check compatibility
  const hasCompatibility = hasCompatibilityData(rule.compatibility);

  // Initialize vote count and check user vote status
  useEffect(() => {
    setVoteCount(safeRule.votes);
    
    async function checkVoteStatus() {
      if (!rule) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          return;
        }

        const { data } = await supabase
          .from('user_votes')
          .select('id')
          .eq('rule_id', rule.id)
          .eq('user_id', session.user.id)
          .maybeSingle();

        setHasVoted(!!data);
      } catch (error) {
        console.error('Error checking vote status:', error);
      }
    }

    checkVoteStatus();
  }, [rule, supabase, safeRule.votes]);

  // Handle copying rule content to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(safeRule.content);
      toast.success('Rule content copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  // Handle downloading the rule
  const downloadRule = async () => {
    try {
      setDownloading(true);
      
      // Create downloadable content (add metadata as YAML front matter)
      const content = `---
title: ${safeRule.title}
description: ${safeRule.description}
version: ${safeRule.version}
lastUpdated: ${rule.last_updated || new Date().toISOString()}
category: ${safeRule.categoryName}
---

${safeRule.content}`;
      
      // Create blob and download link
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${rule.slug || rule.id}.mdc`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Update download count in database
      await incrementRuleDownloads(rule.id);
      
      toast.success('Rule downloaded successfully');
    } catch (error) {
      console.error('Failed to download rule:', error);
      toast.error('Failed to download rule');
    } finally {
      setDownloading(false);
    }
  };

  // Handle voting for the rule
  const handleVote = async () => {
    try {
      setIsVoting(true);

      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        toast("Please sign in to vote", {
          action: {
            label: "Sign in",
            onClick: () => router.push("/auth/login")
          }
        });
        return;
      }

      if (hasVoted) {
        // Remove vote
        await supabase.rpc('remove_rule_vote', { rule_id: rule.id });
        setHasVoted(false);
        setVoteCount(count => Math.max(0, count - 1));
        toast.success("Vote removed");
      } else {
        // Add vote
        await supabase.rpc('vote_for_rule', { rule_id: rule.id });
        setHasVoted(true);
        setVoteCount(count => count + 1);
        toast.success("Vote added");
      }

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to register vote");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{safeRule.title}</DialogTitle>
          <DialogDescription className="text-base">{safeRule.description}</DialogDescription>
          
          {safeRule.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {safeRule.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 p-6 overflow-auto">
          <div className="md:col-span-2">
            <Tabs defaultValue="content">
              <TabsList className="mb-4">
                <TabsTrigger value="content">Rule Content</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                {hasExamples && (
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="content" className="min-h-[300px]">
                <div className="border rounded-md p-4 bg-muted/30 overflow-auto max-h-[400px]">
                  <SafeContentRenderer content={safeRule.content} />
                </div>
              </TabsContent>
              
              <TabsContent value="compatibility">
                <Card>
                  <CardContent className="p-6">
                    {hasCompatibility ? (
                      <div className="space-y-4">
                        {rule.compatibility?.frameworks && Array.isArray(rule.compatibility.frameworks) && rule.compatibility.frameworks.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Frameworks</h3>
                            <div className="flex flex-wrap gap-2">
                              {rule.compatibility.frameworks.map((framework) => (
                                <Badge key={framework} variant="outline">{framework}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {rule.compatibility?.ides && Array.isArray(rule.compatibility.ides) && rule.compatibility.ides.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">IDEs</h3>
                            <div className="flex flex-wrap gap-2">
                              {rule.compatibility.ides.map((ide) => (
                                <Badge key={ide} variant="outline">{ide}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {rule.compatibility?.aiAssistants && Array.isArray(rule.compatibility.aiAssistants) && rule.compatibility.aiAssistants.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">AI Assistants</h3>
                            <div className="flex flex-wrap gap-2">
                              {rule.compatibility.aiAssistants.map((assistant) => (
                                <Badge key={assistant} variant="outline">{assistant}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No compatibility information specified.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {hasExamples && (
                <TabsContent value="examples">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {safeExamples.map(([title, example]) => (
                          <div key={title} className="space-y-2">
                            <h3 className="font-medium">{title}</h3>
                            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                              {typeof example === 'string' ? example : JSON.stringify(example, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rule Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Last Updated:</span>
                  <span>{formattedDate}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Downloads:</span>
                  <span>{safeRule.downloads}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Votes:</span>
                  <span>{voteCount}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Version:</span>
                  <span>{safeRule.version}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Icons.code className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Category:</span>
                  <span>{safeRule.categoryName}</span>
                </div>

                {rule.always_apply !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <Icons.settings className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Always Apply:</span>
                    <span>{rule.always_apply ? 'Yes' : 'No'}</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={copyToClipboard}
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={downloadRule}
                  disabled={downloading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {downloading ? 'Downloading...' : 'Download Rule'}
                </Button>
                <Button 
                  variant={hasVoted ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={handleVote}
                  disabled={isVoting}
                >
                  {isVoting ? (
                    <Icons.loader className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ThumbsUp className="h-4 w-4 mr-2" />
                  )}
                  {isVoting ? "Processing..." : hasVoted ? "Remove Vote" : "Vote for this Rule"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
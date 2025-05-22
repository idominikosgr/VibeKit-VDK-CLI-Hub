import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clipboard, Download, ThumbsUp, Calendar, Users, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Rule } from '@/lib/types';
import { toast } from 'sonner';
import { incrementRuleDownloads } from '@/lib/services/supabase-rule-service';
import Markdown from 'react-markdown';

interface RuleModalProps {
  rule: Rule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RuleModal({ rule, open, onOpenChange }: RuleModalProps) {
  const [downloading, setDownloading] = useState(false);

  if (!rule) return null;

  // Format the date for display
  const formattedDate = rule.last_updated 
    ? new Date(rule.last_updated).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Unknown';

  // Extract author from rule if available
  const author = rule.author || null;

  // Handle copying rule content to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rule.content);
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
title: ${rule.title}
description: ${rule.description}
version: ${rule.version}
lastUpdated: ${rule.last_updated || new Date().toISOString()}
category: ${rule.categoryName || ''}
---

${rule.content}`;
      
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{rule.title}</DialogTitle>
          <DialogDescription className="text-base">{rule.description}</DialogDescription>
          
          {rule.tags && rule.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {rule.tags.map((tag) => (
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
                {rule.examples && Object.keys(rule.examples).length > 0 && (
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="content" className="min-h-[300px]">
                <div className="prose dark:prose-invert max-w-none border rounded-md p-4 bg-muted/30 overflow-auto">
                  {rule.content ? (
                    <Markdown>{rule.content}</Markdown>
                  ) : (
                    <p className="text-muted-foreground italic">No content available for this rule.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="compatibility">
                <Card>
                  <CardContent className="p-6">
                    {rule.compatibility && Object.values(rule.compatibility).some(arr => arr && arr.length > 0) ? (
                      <div className="space-y-4">
                        {rule.compatibility.frameworks && rule.compatibility.frameworks.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Frameworks</h3>
                            <div className="flex flex-wrap gap-2">
                              {rule.compatibility.frameworks.map((framework) => (
                                <Badge key={framework} variant="outline">{framework}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {rule.compatibility.ides && rule.compatibility.ides.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">IDEs</h3>
                            <div className="flex flex-wrap gap-2">
                              {rule.compatibility.ides.map((ide) => (
                                <Badge key={ide} variant="outline">{ide}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {rule.compatibility.aiAssistants && rule.compatibility.aiAssistants.length > 0 && (
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
              
              {rule.examples && Object.keys(rule.examples).length > 0 && (
                <TabsContent value="examples">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {Object.entries(rule.examples).map(([title, example]) => (
                          <div key={title} className="space-y-2">
                            <h3 className="font-medium">{title}</h3>
                            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">{typeof example === 'string' ? example : JSON.stringify(example, null, 2)}</pre>
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
                  <span>{rule.downloads}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Votes:</span>
                  <span>{rule.votes}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Version:</span>
                  <span>{rule.version}</span>
                </div>
                
                {author && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Author:</span>
                    <span>{author}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <Icons.code className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Category:</span>
                  <span>{rule.categoryName || 'Uncategorized'}</span>
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
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Vote for this Rule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
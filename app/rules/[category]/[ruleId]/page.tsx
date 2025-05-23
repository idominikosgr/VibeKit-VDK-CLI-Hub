'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Rule } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { RuleModal } from "@/components/rules/rule-modal";
import { RuleActions } from "@/components/rules/rule-actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Define the rule page props
interface RulePageProps {
  params: Promise<{
    category: string;
    ruleId: string;
  }>;
}

// Helper function to sanitize rule data for React state
function sanitizeRuleData(rule: any): Rule {
  return {
    id: rule.id || '',
    title: rule.title || '',
    slug: rule.slug || '',
    path: rule.path || '',
    description: rule.description || '',
    content: rule.content || '',
    version: rule.version || '1.0.0',
    category_id: rule.category_id || '',
    tags: Array.isArray(rule.tags) ? rule.tags : null,
    globs: Array.isArray(rule.globs) ? rule.globs : null,
    downloads: typeof rule.downloads === 'number' ? rule.downloads : 0,
    votes: typeof rule.votes === 'number' ? rule.votes : 0,
    compatibility: rule.compatibility && typeof rule.compatibility === 'object' ? {
      ides: Array.isArray(rule.compatibility.ides) ? rule.compatibility.ides : [],
      aiAssistants: Array.isArray(rule.compatibility.aiAssistants) ? rule.compatibility.aiAssistants : [],
      frameworks: Array.isArray(rule.compatibility.frameworks) ? rule.compatibility.frameworks : [],
      mcpServers: Array.isArray(rule.compatibility.mcpServers) ? rule.compatibility.mcpServers : []
    } : null,
    examples: rule.examples && typeof rule.examples === 'object' ? rule.examples : null,
    always_apply: typeof rule.always_apply === 'boolean' ? rule.always_apply : null,
    last_updated: typeof rule.last_updated === 'string' ? rule.last_updated : null,
    created_at: typeof rule.created_at === 'string' ? rule.created_at : null,
    updated_at: typeof rule.updated_at === 'string' ? rule.updated_at : null,
    categoryName: typeof rule.categoryName === 'string' ? rule.categoryName : undefined,
    categorySlug: typeof rule.categorySlug === 'string' ? rule.categorySlug : undefined,
  };
}

export default function RulePage({ params }: RulePageProps) {
  const router = useRouter();
  const [awaitedParams, setAwaitedParams] = useState<{ category: string; ruleId: string } | null>(null);
  const [rule, setRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const supabase = createBrowserSupabaseClient();

  // Await params
  useEffect(() => {
    async function awaitParams() {
      try {
        const resolved = await params;
        setAwaitedParams(resolved);
      } catch (err) {
        console.error('Error awaiting params:', err);
        setError('Failed to load page parameters');
      }
    }
    awaitParams();
  }, [params]);

  // Load rule data
  useEffect(() => {
    async function loadRule() {
      if (!awaitedParams) return;
      
      try {
        setLoading(true);
        
        // Fetch rule from API
        const response = await fetch(`/api/rules/${awaitedParams.category}/${awaitedParams.ruleId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Rule not found');
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to load rule');
          }
          return;
        }
        
        const data = await response.json();
        
        // Sanitize the rule data before setting it in state
        const sanitizedRule = sanitizeRuleData(data.rule);
        setRule(sanitizedRule);
      } catch (err) {
        console.error('Error loading rule:', err);
        setError('Failed to load rule');
      } finally {
        setLoading(false);
      }
    }
    
    loadRule();
  }, [awaitedParams]);

  // Format date for display
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

  // Handle download with database increment
  const handleDownload = async () => {
    if (!rule) return;
    
    try {
      // Create downloadable content with metadata
      const content = `---
title: ${rule.title}
description: ${rule.description}
version: ${rule.version}
lastUpdated: ${rule.last_updated || new Date().toISOString()}
category: ${rule.categoryName || awaitedParams?.category}
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
      
      // Increment download count in database
      try {
        await supabase.rpc('increment_rule_downloads', { rule_id: rule.id });
        console.log('Download count incremented for rule:', rule.id);
        
        // Update local rule state to reflect new download count
        setRule(prev => prev ? { ...prev, downloads: (prev.downloads || 0) + 1 } : null);
        toast.success(`Downloaded ${rule.slug || rule.id}.mdc`);
      } catch (dbError) {
        console.error('Failed to increment download count:', dbError);
        toast.success(`Downloaded ${rule.slug || rule.id}.mdc`);
        // Don't fail the download if DB update fails
      }
    } catch (error) {
      console.error('Failed to download rule:', error);
      toast.error('Failed to download rule');
    }
  };

  // Handle copy action  
  const handleCopy = async () => {
    if (!rule?.content) return;
    
    try {
      await navigator.clipboard.writeText(rule.content);
      toast.success('Rule content copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  // Show loading state while params are being awaited or rule is being fetched
  if (!awaitedParams || loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link href="/rules" className="hover:text-foreground">Rules</Link>
          <span>/</span>
          {awaitedParams ? (
            <>
              <Link href={`/rules/${awaitedParams.category}`} className="hover:text-foreground">
                {awaitedParams.category}
              </Link>
              <span>/</span>
              <span className="text-foreground">Loading...</span>
            </>
          ) : (
            <span className="text-foreground">Loading...</span>
          )}
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
          <Link href={`/rules/${awaitedParams.category}`} className="hover:text-foreground">
            {awaitedParams.category}
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
          <Link href={`/rules/${awaitedParams.category}`} className="hover:text-foreground">
            {awaitedParams.category}
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
                    <dd>{rule.downloads || 0} {(rule.downloads || 0) === 1 ? 'download' : 'downloads'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Votes</dt>
                    <dd>{rule.votes || 0} {(rule.votes || 0) === 1 ? 'vote' : 'votes'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                    <dd className="flex items-center gap-1">
                      <span>{rule.categoryName || awaitedParams?.category}</span>
                    </dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter className="border-t pt-4">
                {/* Use the RuleActions component for proper functionality */}
                <RuleActions rule={rule} onDownload={handleDownload} />
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

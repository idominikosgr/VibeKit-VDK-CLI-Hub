"use client"

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Rule } from '@/lib/types';
import { Icons } from '@/components/icons';

export interface RulePreviewProps {
  rule: Rule;
  showCategory?: boolean;
}

export function RulePreview({ rule, showCategory = false }: RulePreviewProps) {
  if (!rule) {
    console.error('Invalid rule object provided to RulePreview component');
    return null;
  }

  // Format the date
  const lastUpdated = rule.last_updated
    ? new Date(rule.last_updated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown';

  // Clean up votes
  const votes = rule.votes || 0;
  
  // Clean up downloads
  const downloads = rule.downloads || 0;
  
  // Clean up tags
  const tags = rule.tags || [];
  
  // Ensure we have a valid category ID
  const category_id = rule.category_id || 'unknown';

  const ruleLink = `/rules/${category_id}/${rule.id}`;

  return (
    <Link href={ruleLink} className="block">
      <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="line-clamp-2">{rule.title}</CardTitle>
            {votes > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Icons.thumbsUp className="h-3.5 w-3.5 text-green-500" />
                <span>{votes}</span>
              </div>
            )}
          </div>
          
          {showCategory && rule.category_id && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                {rule.categoryName || rule.category_id}
              </Badge>
            </div>
          )}
          
          <CardDescription className="line-clamp-3 mt-2">
            {rule.description}
          </CardDescription>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardFooter className="border-t pt-3 flex justify-between items-center text-xs text-muted-foreground">
          <div>
            {downloads} {downloads === 1 ? "download" : "downloads"}
          </div>
          <div className="flex items-center gap-2">
            <span>{lastUpdated}</span>
            {rule.version && <span>v{rule.version}</span>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

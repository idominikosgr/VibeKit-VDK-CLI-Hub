import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit3, Trash2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { getCollection } from '@/lib/services/collection-service';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

// Force dynamic rendering to prevent static generation errors with cookies
export const dynamic = 'force-dynamic';

interface CollectionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const awaitedParams = await params;
  const supabase = await createServerSupabaseClient();

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    notFound();
  }

  try {
    // Get collection details
    const collection = await getCollection(awaitedParams.id, session.user.id);

    if (!collection) {
      notFound();
    }

    return (
      <div className="container py-10">
        <div className="flex flex-col gap-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/collections" className="hover:text-foreground">
              Collections
            </Link>
            <span>/</span>
            <span className="text-foreground">{collection.name}</span>
          </div>

          {/* Collection header */}
          <div className="flex items-start justify-between">
            <div>
                             <div className="flex items-center gap-2">
                 <Icons.folder className="h-5 w-5" />
                 <h1 className="text-3xl font-bold">{collection.name}</h1>
                {collection.is_public ? (
                  <Badge variant="outline">Public</Badge>
                ) : (
                  <Badge variant="outline">Private</Badge>
                )}
              </div>
              <p className="mt-2 text-lg text-muted-foreground">{collection.description}</p>
            </div>
                         <Button variant="outline" asChild>
               <Link href={`/collections/${collection.id}/edit`}>
                 <Icons.settings className="mr-2 h-4 w-4" />
                 Edit Collection
               </Link>
             </Button>
          </div>

          {/* Rules list */}
          {collection.rules && collection.rules.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                Rules ({collection.rules.length})
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {collection.rules.map((rule) => (
                  <Card key={rule.id} className="overflow-hidden transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            <Link 
                              href={`/rules/${rule.categorySlug || 'core'}/${rule.id}`}
                              className="hover:text-primary"
                            >
                              {rule.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {rule.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {rule.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Version {rule.version}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/rules/${rule.categorySlug || 'core'}/${rule.id}`}>
                          View Rule
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
                         <div className="flex flex-col items-center justify-center py-16 text-center">
               <Icons.folder className="h-16 w-16 text-muted-foreground mb-4" />
               <h3 className="text-2xl font-bold mb-2">No rules in this collection</h3>
              <p className="text-muted-foreground mb-6">
                Start adding rules to organize your favorites.
              </p>
              <Button asChild>
                <Link href="/rules">Browse Rules</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading collection:', error);
    notFound();
  }
} 
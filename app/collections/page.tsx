import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { getUserCollections } from "@/lib/services/collection-service";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export default async function CollectionsPage() {
  const supabase = await createServerSupabaseClient();

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    // Redirect unauthenticated users to login
    redirect("/auth/login?returnTo=/collections");
  }

  // Get user collections
  const collections = await getUserCollections(session.user.id);

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Collections</h1>
          <Button asChild>
            <Link href="/collections/new">
              <Icons.userPlus className="mr-2 h-4 w-4" />
              Create Collection
            </Link>
          </Button>
        </div>

        {collections.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <Card className="h-full overflow-hidden hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="line-clamp-2">{collection.name}</CardTitle>
                      {collection.is_public ? (
                        <Badge variant="outline">Public</Badge>
                      ) : (
                        <Badge variant="outline">Private</Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-3 mt-2">
                      {collection.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      {collection.rules?.length || 0} rules
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated {collection.updated_at ? new Date(collection.updated_at).toLocaleDateString() : 'Unknown'}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Icons.folder className="h-12 w-12 text-muted-foreground" />}
            title="No collections yet"
            description="Create your first collection to organize your favorite rules."
            action={
              <Button asChild>
                <Link href="/collections/new">
                  <Icons.userPlus className="mr-2 h-4 w-4" />
                  Create Collection
                </Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}

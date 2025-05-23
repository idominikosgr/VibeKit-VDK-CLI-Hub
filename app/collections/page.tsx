import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { getUserCollections } from "@/lib/services/collection-service";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { CollectionsPageClient } from "@/components/collections/collections-page-client";

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

  return <CollectionsPageClient collections={collections} />;
}

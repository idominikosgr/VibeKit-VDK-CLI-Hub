import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { CollectionForm } from "@/components/collections/collection-form";

export default async function NewCollectionPage() {
  const supabase = await createServerSupabaseClient();

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    // Redirect unauthenticated users to login
    redirect("/auth/login?returnTo=/collections/new");
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Create Collection</h1>
          <p className="mt-2 text-muted-foreground">
            Create a personal collection to organize your favorite rules.
          </p>
        </div>

        <CollectionForm userId={session.user.id} />
      </div>
    </div>
  );
}

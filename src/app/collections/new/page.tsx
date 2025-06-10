import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
// import { CollectionForm } from "@/components/collections/collection-form";

// Force dynamic rendering to prevent static generation errors with cookies
export const dynamic = 'force-dynamic';

export default async function NewCollectionPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Collection</h1>
          <p className="text-muted-foreground">
            Organize your favorite rules into a custom collection.
          </p>
        </div>
        
        <div className="text-center py-8">
          <p className="text-muted-foreground">Collection form temporarily unavailable</p>
        </div>
        
        {/* <CollectionForm userId={user.id} /> */}
      </div>
    </div>
  );
}

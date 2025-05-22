// Service for managing user collections - FIXED SCHEMA ALIGNMENT
import { createServerSupabaseClient } from "../supabase/server-client";
import { Collection, Rule } from "../types";
import { ApiError, errorLogger } from "../error-handling";
import { Database } from "../supabase/database.types";

type DbCollection = Database['public']['Tables']['collections']['Row'];
type DbRule = Database['public']['Tables']['rules']['Row'];

// Helper function to map database collection to application collection
// FIXED: Use correct database field names (snake_case)
const mapDbCollectionToCollection = (dbCollection: DbCollection, includeRules: boolean = false): Collection => {
  return {
    id: dbCollection.id,
    name: dbCollection.name,
    description: dbCollection.description,
    user_id: dbCollection.user_id, // FIXED: Use snake_case to match DB schema
    is_public: dbCollection.is_public, // FIXED: Use snake_case to match DB schema
    rules: includeRules ? [] : undefined, // Rules handled separately
    created_at: dbCollection.created_at, // FIXED: Use snake_case to match DB schema
    updated_at: dbCollection.updated_at, // FIXED: Use snake_case to match DB schema
  };
};

// Helper function to map database rule to application rule
// FIXED: Use correct database field names and handle nullable fields
const mapDbRuleToRule = (dbRule: DbRule): Rule => {
  return {
    id: dbRule.id,
    title: dbRule.title,
    slug: dbRule.slug,
    path: dbRule.path,
    content: dbRule.content,
    description: dbRule.description,
    version: dbRule.version,
    category_id: dbRule.category_id, // FIXED: Use snake_case
    tags: dbRule.tags, // Keep nullable
    globs: dbRule.globs, // Keep nullable
    downloads: dbRule.downloads, // Keep nullable
    votes: dbRule.votes, // Keep nullable
    compatibility: dbRule.compatibility as Rule['compatibility'], // Proper type casting
    examples: dbRule.examples as Rule['examples'], // Proper type casting
    always_apply: dbRule.always_apply, // FIXED: Use snake_case
    last_updated: dbRule.last_updated, // FIXED: Use snake_case
    created_at: dbRule.created_at, // FIXED: Use snake_case
    updated_at: dbRule.updated_at, // FIXED: Use snake_case
  };
};

// Get all collections for a user
export async function getUserCollections(userId: string): Promise<Collection[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', userId) // FIXED: Use snake_case field name
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(collection => mapDbCollectionToCollection(collection));
  } catch (error) {
    errorLogger.log(error, 'getUserCollections');
    return [];
  }
}

// Get a single collection by ID
// FIXED: Use correct table name 'collection_items' instead of 'collection_rules'
export async function getCollection(collectionId: string, userId?: string): Promise<Collection | null> {
  try {
    const supabase = await createServerSupabaseClient();

    // Build the query - FIXED: Use correct table name 'collection_items'
    let query = supabase
      .from('collections')
      .select(`
        *,
        collection_items (
          rule_id,
          rules (*)
        )
      `)
      .eq('id', collectionId)
      .single();

    // If userId is provided, ensure we're only retrieving collections owned by this user
    // or public collections
    if (userId) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    // Transform rules from the join table - FIXED: Use collection_items
    const rules: Rule[] = data.collection_items?.map((item: any) => 
      mapDbRuleToRule(item.rules)
    ) || [];

    // Return the collection with rules
    return {
      ...mapDbCollectionToCollection(data),
      rules,
    };
  } catch (error) {
    errorLogger.log(error, 'getCollection');
    return null;
  }
}

// Create a new collection
// FIXED: Use correct database field names in insert
export async function createCollection(
  collection: Omit<Collection, 'id' | 'created_at' | 'updated_at'>, 
  userId: string
): Promise<Collection | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('collections')
      .insert({
        name: collection.name,
        description: collection.description,
        user_id: userId, // FIXED: Use snake_case
        is_public: collection.is_public, // FIXED: Use snake_case
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbCollectionToCollection(data);
  } catch (error) {
    errorLogger.log(error, 'createCollection');
    return null;
  }
}

// Update an existing collection
// FIXED: Use correct database field names
export async function updateCollection(
  collection: Partial<Collection> & { id: string }, 
  userId: string
): Promise<Collection | null> {
  try {
    const supabase = await createServerSupabaseClient();

    // First verify ownership
    const { data: existingCollection, error: fetchError } = await supabase
      .from('collections')
      .select('user_id')
      .eq('id', collection.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Ensure the user owns this collection
    if (existingCollection?.user_id !== userId) {
      throw new Error('You do not have permission to update this collection');
    }

    // Prepare the update data - FIXED: Use snake_case field names
    const updateData: any = {};
    if (collection.name) updateData.name = collection.name;
    if (collection.description !== undefined) updateData.description = collection.description;
    if (collection.is_public !== undefined) updateData.is_public = collection.is_public; // FIXED: Use snake_case

    // Update the collection
    const { data, error } = await supabase
      .from('collections')
      .update(updateData)
      .eq('id', collection.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbCollectionToCollection(data);
  } catch (error) {
    errorLogger.log(error, 'updateCollection');
    return null;
  }
}

// Add a rule to a collection
// FIXED: Use correct table name 'collection_items'
export async function addRuleToCollection(collectionId: string, ruleId: string, userId: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();

    // First verify ownership
    const { data: collection, error: fetchError } = await supabase
      .from('collections')
      .select('user_id')
      .eq('id', collectionId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Ensure the user owns this collection
    if (collection?.user_id !== userId) {
      throw new Error('You do not have permission to modify this collection');
    }

    // Add the rule to the collection - FIXED: Use correct table name
    const { error } = await supabase
      .from('collection_items')
      .insert({
        collection_id: collectionId,
        rule_id: ruleId,
      });

    if (error) {
      // If error is duplicate, just ignore
      if (error.code === '23505') {
        // Rule already in collection
        return true;
      }
      throw error;
    }

    return true;
  } catch (error) {
    errorLogger.log(error, 'addRuleToCollection');
    return false;
  }
}

// Remove a rule from a collection
// FIXED: Use correct table name 'collection_items'
export async function removeRuleFromCollection(collectionId: string, ruleId: string, userId: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();

    // First verify ownership
    const { data: collection, error: fetchError } = await supabase
      .from('collections')
      .select('user_id')
      .eq('id', collectionId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Ensure the user owns this collection
    if (collection?.user_id !== userId) {
      throw new Error('You do not have permission to modify this collection');
    }

    // Remove the rule from the collection - FIXED: Use correct table name
    const { error } = await supabase
      .from('collection_items')
      .delete()
      .eq('collection_id', collectionId)
      .eq('rule_id', ruleId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    errorLogger.log(error, 'removeRuleFromCollection');
    return false;
  }
}

// Delete a collection
// FIXED: Use correct table name 'collection_items'
export async function deleteCollection(collectionId: string, userId: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();

    // First verify ownership
    const { data: collection, error: fetchError } = await supabase
      .from('collections')
      .select('user_id')
      .eq('id', collectionId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Ensure the user owns this collection
    if (collection?.user_id !== userId) {
      throw new Error('You do not have permission to delete this collection');
    }

    // Delete all rules from the collection first - FIXED: Use correct table name
    // (cascade would handle this, but let's be explicit)
    await supabase
      .from('collection_items')
      .delete()
      .eq('collection_id', collectionId);

    // Delete the collection
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', collectionId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    errorLogger.log(error, 'deleteCollection');
    return false;
  }
}

// Get public collections (for discovery)
export async function getPublicCollections(limit: number = 20): Promise<Collection[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_public', true) // FIXED: Use snake_case
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data || []).map(collection => mapDbCollectionToCollection(collection));
  } catch (error) {
    errorLogger.log(error, 'getPublicCollections');
    return [];
  }
}

// Get collection with rule count (for listing views)
export async function getCollectionsWithCounts(userId: string): Promise<(Collection & { ruleCount: number })[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        collection_items (count)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(collection => ({
      ...mapDbCollectionToCollection(collection),
      ruleCount: collection.collection_items?.length || 0
    }));
  } catch (error) {
    errorLogger.log(error, 'getCollectionsWithCounts');
    return [];
  }
}
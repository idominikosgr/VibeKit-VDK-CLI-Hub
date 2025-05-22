import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { findRuleByIdentifier, getRule } from '@/lib/services/supabase-rule-service';

/**
 * Debugging API endpoint to help diagnose rule lookup issues
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ruleId = searchParams.get('ruleId');
    const category_id = searchParams.get('category_id');
    
    const supabase = await createServerSupabaseClient();
    const results: any = {
      timestamp: new Date().toISOString(),
      message: 'Debug information for rules lookup',
    };
    
    // If ruleId is provided, run specific debugging for that rule
    if (ruleId) {
      console.log(`[DEBUG API] Analyzing ID: ${ruleId}`);
      results.requestedRule = {
        ruleId,
        category_id: category_id || 'not provided'
      };
      
      // Check if this ID is likely a UUID or a rule filename
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUuid = uuidPattern.test(ruleId);
      results.idFormat = {
        looksLikeUuid: isUuid,
        looksLikeFilename: /^[a-zA-Z0-9-_.]+$/.test(ruleId) && !isUuid
      };
      
      // For UUIDs, check if it's a category first - this is most important
      if (isUuid) {
        console.log(`[DEBUG API] ${ruleId} is a UUID, checking if it's a category`);
        
        // Check categories table
        const { data: categoryMatch } = await supabase
          .from('categories')
          .select('id, name, slug')
          .eq('id', ruleId)
          .maybeSingle();
        
        if (categoryMatch) {
          console.log(`[DEBUG API] UUID ${ruleId} matches category: ${categoryMatch.name}`);
          results.categoryMatch = categoryMatch;
          results.idType = 'CATEGORY_UUID';
          results.recommendation = {
            action: 'REDIRECT_TO_CATEGORY',
            path: `/rules/${ruleId}`,
            message: `This is a category UUID. Redirect to the category page.`
          };
        } else {
          console.log(`[DEBUG API] UUID ${ruleId} is not a category ID`);
          results.categoryMatch = null;
          
          // Check if it might be a rule UUID (although rules typically use filenames)
          const { data: ruleMatch } = await supabase
            .from('rules')
            .select('id, title, category_id')
            .eq('id', ruleId)
            .maybeSingle();
          
          if (ruleMatch) {
            console.log(`[DEBUG API] UUID ${ruleId} matches a rule`);
            results.idType = 'RULE_UUID';
            results.ruleMatch = ruleMatch;
            results.recommendation = {
              action: 'REDIRECT_TO_RULE',
              path: `/rules/${ruleMatch.category_id}/${ruleMatch.id}`,
              message: `This is a rule UUID. Redirect to the rule page.`
            };
          } else {
            console.log(`[DEBUG API] UUID ${ruleId} does not match any rule or category`);
            results.idType = 'UNKNOWN_UUID';
            results.recommendation = {
              action: 'SHOW_ERROR',
              message: `This UUID does not match any known rule or category.`
            };
          }
        }
      } else {
        // If not a UUID, check if it's a rule slug or filename
        console.log(`[DEBUG API] ${ruleId} is not a UUID, checking if it's a rule ID`);
        
        // First check categories by slug
        const { data: slugCategoryMatch } = await supabase
          .from('categories')
          .select('id, name, slug')
          .eq('slug', ruleId)
          .maybeSingle();
        
        if (slugCategoryMatch) {
          console.log(`[DEBUG API] ${ruleId} matches category slug: ${slugCategoryMatch.name}`);
          results.categoryMatch = slugCategoryMatch;
          results.idType = 'CATEGORY_SLUG';
          results.recommendation = {
            action: 'REDIRECT_TO_CATEGORY',
            path: `/rules/${slugCategoryMatch.id}`, // Using ID is more reliable than slug
            message: `This is a category slug. Redirect to the category page.`
          };
        } else {
          // Check rule ID/slug directly
          try {
            const directRule = await findRuleByIdentifier(ruleId);
            if (directRule) {
              console.log(`[DEBUG API] ${ruleId} matches rule: ${directRule.title}`);
              results.directLookupResult = { 
                success: true, 
                rule: { id: directRule.id, title: directRule.title, category_id: directRule.category_id }
              };
              results.idType = 'RULE_ID';
              results.recommendation = {
                action: 'REDIRECT_TO_RULE',
                path: `/rules/${directRule.category_id}/${directRule.id}`,
                message: `This is a rule ID. Redirect to the rule page.`
              };
            } else {
              console.log(`[DEBUG API] ${ruleId} does not match any known rule`);
              results.directLookupResult = { 
                success: false, 
                message: 'Rule not found by direct ID lookup' 
              };
              results.idType = 'UNKNOWN_ID';
              results.recommendation = {
                action: 'SHOW_ERROR',
                message: `This ID does not match any known rule or category.`
              };
            }
          } catch (error) {
            console.error(`[DEBUG API] Error looking up rule ${ruleId}:`, error);
            results.directLookupError = String(error);
            results.idType = 'ERROR';
            results.recommendation = {
              action: 'SHOW_ERROR',
              message: `Error looking up this ID: ${String(error)}`
            };
          }
        }
      }
      
      // Always include raw category and rule query results for reference
      
      // Check if it matches a category
      const { data: allCategoryMatches } = await supabase
        .from('categories')
        .select('id, name, slug')
        .or(`id.eq.${ruleId},slug.eq.${ruleId}`)
        .limit(5);
      
      results.allCategoryMatches = allCategoryMatches || [];
      
      // Query database directly for all matching rules
      try {
        const { data: directDbRules, error: directDbError } = await supabase
          .from('rules')
          .select('id, title, slug, path, category_id')
          .or(`id.eq.${ruleId},slug.eq.${ruleId}`)
          .limit(5);
        
        if (directDbError) {
          results.directDbError = directDbError.message;
        } else {
          results.directDbResults = {
            count: directDbRules?.length || 0,
            rules: directDbRules || []
          };
        }
      } catch (dbError) {
        results.directDbQueryError = String(dbError);
      }
    } else {
      // Get sample of rules from database for general inspection
      const { data: rules, error } = await supabase
        .from('rules')
        .select('id, title, slug, path, category_id, updated_at')
        .order('updated_at', { ascending: false })
        .limit(10);
      
      if (error) {
        results.rulesError = error.message;
      } else {
        results.recentRules = {
          count: rules?.length || 0,
          rules: rules || []
        };
      }
      
      // Get categories
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .limit(10);
      
      if (catError) {
        results.categoriesError = catError.message;
      } else {
        results.categories = categories || [];
      }
    }
    
    // Return debug information
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in debug route:', error);
    return NextResponse.json(
      { error: 'Failed to process debug request', details: String(error) },
      { status: 500 }
    );
  }
} 
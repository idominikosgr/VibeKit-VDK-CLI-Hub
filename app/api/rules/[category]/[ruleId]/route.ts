import { NextRequest, NextResponse } from 'next/server';
import { getRule } from '@/lib/services/supabase-rule-service';

// Helper function to ensure the object is serializable
function ensureSerializable<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Failed to serialize object:', error);
    throw new Error('Data serialization error');
  }
}

// Helper to process dates to ensure they're serializable
function formatDates(rule: any): any {
  if (!rule) return rule;
  
  const processed = { ...rule };
  
  // Format lastUpdated if it exists
  if (processed.lastUpdated) {
    try {
      // Convert to ISO string if it's a valid date
      const date = new Date(processed.lastUpdated);
      // Check if the date is valid before converting
      if (!isNaN(date.getTime())) {
        processed.lastUpdated = date.toISOString();
      } else {
        processed.lastUpdated = null;
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      processed.lastUpdated = null;
    }
  }
  
  return processed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; ruleId: string } }
) {
  try {
    // Ensure params are properly awaited (for Next.js 15+)
    const awaitedParams = await Promise.resolve(params);
    const { ruleId } = awaitedParams;
    
    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`[API] Getting rule: ${ruleId}`);
    
    // Fetch the rule
    const rule = await getRule(ruleId);
    
    if (!rule) {
      return NextResponse.json(
        { error: `Rule not found: ${ruleId}` },
        { status: 404 }
      );
    }
    
    // Return the rule with the expected format
    return NextResponse.json({
      rule: ensureSerializable(rule)
    });
  } catch (error) {
    console.error(`[API] Error fetching rule:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to load rule',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 
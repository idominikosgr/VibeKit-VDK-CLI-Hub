import { NextRequest, NextResponse } from 'next/server';
import { getRule } from '@/lib/services/supabase-rule-service';

// Helper function to deeply ensure the object is serializable
function ensureSerializable<T>(obj: T): T {
  try {
    // Deep clone to remove any non-serializable properties
    const serialized = JSON.parse(JSON.stringify(obj));
    
    // Ensure dates are properly formatted as ISO strings
    if (serialized && typeof serialized === 'object') {
      Object.keys(serialized).forEach(key => {
        const value = serialized[key];
        
        // Handle date strings
        if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              serialized[key] = date.toISOString();
            }
          } catch (e) {
            // If it fails, keep the original value
          }
        }
        
        // Ensure null values are preserved (not undefined)
        if (value === undefined) {
          serialized[key] = null;
        }
      });
    }
    
    return serialized;
  } catch (error) {
    console.error('Failed to serialize object:', error);
    throw new Error('Data serialization error');
  }
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
    
    // Ensure the rule is properly serialized
    const serializedRule = ensureSerializable(rule);
    
    // Return the rule with the expected format
    return NextResponse.json({
      rule: serializedRule
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
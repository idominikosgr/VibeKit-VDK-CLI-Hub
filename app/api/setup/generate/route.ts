import { NextRequest, NextResponse } from 'next/server';
import { RuleGenerationEngine } from '@/lib/services/rule-generator';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.stackChoices || !body.languageChoices || !body.toolPreferences || !body.environmentDetails) {
      return NextResponse.json(
        { error: 'Missing required configuration fields' },
        { status: 400 }
      );
    }

    // Create wizard configuration
    const wizardConfig = {
      stackChoices: body.stackChoices,
      languageChoices: body.languageChoices,
      toolPreferences: body.toolPreferences,
      environmentDetails: body.environmentDetails,
      outputFormat: body.outputFormat || 'zip',
      customRequirements: body.customRequirements,
      userId: body.userId,
      sessionId: body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Initialize rule generation engine
    const supabase = await createServerSupabaseClient();
    const generator = new RuleGenerationEngine(supabase);

    // Generate package
    const packageResult = await generator.generatePackage(wizardConfig);

    return NextResponse.json({
      success: true,
      package: packageResult
    });

  } catch (error) {
    console.error('Error generating setup package:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate setup package',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get test configuration for development
    const testConfig = {
      stackChoices: {
        react: true,
        nextjs: true,
        typescript: true
      },
      languageChoices: {
        typescript: true,
        javascript: false
      },
      toolPreferences: {
        eslint: true,
        prettier: true,
        husky: true
      },
      environmentDetails: {
        nodeVersion: '18.0.0',
        packageManager: 'npm',
        outputFormat: 'bash',
        targetEnvironment: 'development'
      }
    };

    return NextResponse.json({
      message: 'Setup generation API is working',
      testConfig,
      endpoints: {
        generate: 'POST /api/setup/generate',
        download: 'GET /api/setup/download/[packageId]'
      }
    });

  } catch (error) {
    console.error('Error in setup API:', error);
    return NextResponse.json(
      { error: 'Setup API error' },
      { status: 500 }
    );
  }
} 
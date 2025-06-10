import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { requireAdmin } from '@/lib/middleware/admin-auth';

// Mock settings - in a real app, these would be stored in a database or environment
const defaultSettings = {
  github: {
    token: process.env.GITHUB_TOKEN || '',
    repoOwner: process.env.GITHUB_REPO_OWNER || 'idominikosgr',
    repoName: process.env.GITHUB_REPO_NAME || 'ai.rules',
    syncInterval: 24,
    autoSync: true
  },
  database: {
    connectionStatus: 'connected' as 'connected' | 'disconnected' | 'error',
    totalTables: 12,
    totalRows: 0,
    lastBackup: null,
    autoBackup: false
  },
  email: {
    provider: 'Gmail',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    username: '',
    enableNotifications: false
  },
  system: {
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    uptime: 86400, // 1 day in seconds
    maintenanceMode: false,
    debugMode: process.env.NODE_ENV === 'development',
    rateLimitEnabled: true,
    maxRequestsPerMinute: 100
  },
  security: {
    sessionTimeout: 480, // 8 hours
    requireEmailVerification: true,
    allowPasswordReset: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  }
};

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    // Get database statistics
    const [rulesCount, categoriesCount, usersCount] = await Promise.all([
      supabase.from('rules').select('id', { count: 'exact' }),
      supabase.from('categories').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' })
    ]);

    // Update settings with real data
    const settings = {
      ...defaultSettings,
      database: {
        ...defaultSettings.database,
        totalRows: (rulesCount.count || 0) + (categoriesCount.count || 0) + (usersCount.count || 0)
      }
    };

    // Test database connection
    try {
      await supabase.from('rules').select('id').limit(1);
      settings.database.connectionStatus = 'connected';
    } catch (error) {
      settings.database.connectionStatus = 'error';
    }

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch settings',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings data is required' },
        { status: 400 }
      );
    }

    // In a real application, you would save these settings to a database
    // For now, we'll just validate the structure and return success
    
    // Validate required fields
    const requiredSections = ['github', 'database', 'email', 'system', 'security'];
    for (const section of requiredSections) {
      if (!settings[section]) {
        return NextResponse.json(
          { error: `Missing required section: ${section}` },
          { status: 400 }
        );
      }
    }

    // Here you would typically save to database or update environment variables
    console.log('Settings update request:', settings);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update settings',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 
#!/usr/bin/env node

/**
 * This script manually sets the required environment variables and runs the sync script
 */

// Set environment variables directly
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://izdtuhiciejisavhpqey.supabase.co';
process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZHR1aGljaWVqaXNhdmhwcWV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzc0OTM3MSwiZXhwIjoyMDYzMzI1MzcxfQ.5GLsldY_6yW35to3NowChJqoof-09jUoB8n_lx8Hujw';
process.env.GITHUB_TOKEN = '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';
process.env.GITHUB_REPO_OWNER = 'idominikosgr';
process.env.GITHUB_REPO_NAME = 'VibeKit-VDK-AI-rules';

// Run the regular sync script
import('./sync-rules');

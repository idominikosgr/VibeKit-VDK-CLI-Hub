#!/usr/bin/env node

/**
 * This script creates the necessary database schema for the Vibe Coding Rules Hub app
 */

// Set environment variables directly
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://izdtuhiciejisavhpqey.supabase.co';
process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZHR1aGljaWVqaXNhdmhwcWV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzc0OTM3MSwiZXhwIjoyMDYzMzI1MzcxfQ.5GLsldY_6yW35to3NowChJqoof-09jUoB8n_lx8Hujw';

import { createClient } from '@supabase/supabase-js';

async function createSchema() {
  console.log('Creating database schema...');
  console.log(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(`Key: ${process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ? 'Set (hidden)' : 'Not Set'}`);
  
  try {
    // Create Supabase Admin client
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase URL or Service Role Key not set');
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create categories table
    console.log('Creating categories table...');
    const { error: categoriesError } = await supabaseAdmin.rpc('create_categories_table');
    if (categoriesError) {
      console.error('Error creating categories table:', categoriesError);
      console.log('Attempting to use SQL directly...');
      
      const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', {
        sql_string: `
          CREATE TABLE IF NOT EXISTS categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
        `
      });
      
      if (sqlError) {
        console.error('Error executing SQL for categories table:', sqlError);
        throw sqlError;
      }
    }
    console.log('Categories table created or already exists.');

    // Create rules table
    console.log('Creating rules table...');
    const { error: rulesError } = await supabaseAdmin.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS rules (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT NOT NULL,
          description TEXT,
          content TEXT,
          path TEXT,
          category_id UUID REFERENCES categories(id),
          tags JSONB DEFAULT '[]'::jsonb,
          compatibility JSONB DEFAULT '{}'::jsonb,
          always_apply BOOLEAN DEFAULT false,
          version TEXT DEFAULT '1.0.0',
          downloads INTEGER DEFAULT 0,
          votes INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS rules_slug_idx ON rules(slug);
        CREATE INDEX IF NOT EXISTS rules_category_id_idx ON rules(category_id);
        CREATE INDEX IF NOT EXISTS rules_tags_idx ON rules USING GIN(tags);
      `
    });
    
    if (rulesError) {
      console.error('Error creating rules table:', rulesError);
      throw rulesError;
    }
    console.log('Rules table created or already exists.');

    // Create rule_versions table
    console.log('Creating rule_versions table...');
    const { error: versionsError } = await supabaseAdmin.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS rule_versions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          rule_id TEXT REFERENCES rules(id) ON DELETE CASCADE,
          version TEXT NOT NULL,
          content TEXT,
          changes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS rule_versions_rule_id_idx ON rule_versions(rule_id);
      `
    });
    
    if (versionsError) {
      console.error('Error creating rule_versions table:', versionsError);
      throw versionsError;
    }
    console.log('Rule_versions table created or already exists.');

    // Create sync_logs table
    console.log('Creating sync_logs table...');
    const { error: logsError } = await supabaseAdmin.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS sync_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          sync_type TEXT NOT NULL,
          added_count INTEGER DEFAULT 0,
          updated_count INTEGER DEFAULT 0,
          error_count INTEGER DEFAULT 0,
          errors JSONB DEFAULT '[]'::jsonb,
          duration_ms INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (logsError) {
      console.error('Error creating sync_logs table:', logsError);
      throw logsError;
    }
    console.log('Sync_logs table created or already exists.');

    console.log('\nSchema creation completed successfully! ✅');
    return true;
  } catch (error) {
    console.error('Error creating schema:', error);
    return false;
  }
}

// Run the schema creation
createSchema()
  .then(success => {
    if (success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Fatal error during schema creation:', error);
    process.exit(1);
  });

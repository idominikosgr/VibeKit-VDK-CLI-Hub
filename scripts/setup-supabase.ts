import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function executeSqlFile(filePath: string): Promise<void> {
  try {
    console.log(`Executing SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Execute the SQL using Supabase's REST API
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error(`Error executing ${filePath}:`, error);
      throw error;
    }
    
    console.log(`✅ Successfully executed ${filePath}`);
    return data;
  } catch (err) {
    console.error(`Failed to execute ${filePath}:`, err);
    throw err;
  }
}

async function setupSupabase() {
  console.log('Setting up Supabase database with consolidated schema');
  console.log('-----------------------------------------------------');
  
  const rootDir = path.resolve(process.cwd());
  const supabaseDir = path.join(rootDir, 'supabase');
  
  try {
    // Step 1: Create tables and structure
    console.log('\n🔹 Step 1: Creating database schema');
    await executeSqlFile(path.join(supabaseDir, 'schema.sql'));
    
    // Step 2: Apply security policies
    console.log('\n🔹 Step 2: Applying security policies');
    await executeSqlFile(path.join(supabaseDir, 'security', 'rls.sql'));
    
    // Step 3: Create functions
    console.log('\n🔹 Step 3: Creating database functions');
    await executeSqlFile(path.join(supabaseDir, 'functions', 'functions.sql'));
    
    // Step 4: Create triggers
    console.log('\n🔹 Step 4: Creating database triggers');
    await executeSqlFile(path.join(supabaseDir, 'triggers', 'triggers.sql'));
    
    // Step 5: Seed the categories table
    console.log('\n🔹 Step 5: Seeding categories');
    await executeSqlFile(path.join(supabaseDir, 'seed', 'categories.sql'));
    
    // Step 6: Seed the rules table
    console.log('\n🔹 Step 6: Seeding rules');
    await executeSqlFile(path.join(supabaseDir, 'seed', 'rules.sql'));
    
    // Step 7: Seed the rule_versions table
    console.log('\n🔹 Step 7: Seeding rule versions');
    await executeSqlFile(path.join(supabaseDir, 'seed', 'rule_versions.sql'));
    
    // Step 8: Seed the sync_logs table
    console.log('\n🔹 Step 8: Seeding sync logs');
    await executeSqlFile(path.join(supabaseDir, 'seed', 'sync_logs.sql'));
    
    // Step 9: Seed the admins table
    console.log('\n🔹 Step 9: Seeding admin users');
    await executeSqlFile(path.join(supabaseDir, 'seed', 'admins.sql'));
    
    console.log('\n✅ Supabase setup completed successfully');
    console.log('All tables, security policies, functions, triggers, and seed data have been created.');
  } catch (err) {
    console.error('\n❌ Supabase setup failed:', err);
    process.exit(1);
  }
}

setupSupabase();

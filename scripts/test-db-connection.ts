#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test connection
    const { data, error } = await supabase
      .from('documentation_pages')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection error:', error);
      return;
    }
    
    console.log(`✅ Connected! Found ${data || 0} documentation pages`);
    
    // Test profiles table
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .limit(5);
    
    if (profilesError) {
      console.error('❌ Profiles error:', profilesError);
      return;
    }
    
    console.log(`✅ Found ${profilesData?.length || 0} profiles`);
    if (profilesData && profilesData.length > 0) {
      console.log('First profile:', profilesData[0]);
    }
    
    // Test tags table
    const { data: tagsData, error: tagsError } = await supabase
      .from('documentation_tags')
      .select('id, name')
      .limit(5);
    
    if (tagsError) {
      console.error('❌ Tags error:', tagsError);
      return;
    }
    
    console.log(`✅ Found ${tagsData?.length || 0} documentation tags`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection(); 
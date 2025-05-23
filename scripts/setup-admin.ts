#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  const adminEmail = 'dominikos@myroomieapp.com'; // Admin email
  
  console.log('🔧 Setting up admin user...');
  
  // Check if admin already exists
  const { data: existingAdmin } = await supabase
    .from('admins')
    .select('email')
    .eq('email', adminEmail)
    .single();
  
  if (existingAdmin) {
    console.log('✅ Admin user already exists');
  } else {
    // Add admin user
    const { error: adminError } = await supabase
      .from('admins')
      .insert({ email: adminEmail });
    
    if (adminError) {
      console.error('❌ Error adding admin user:', adminError);
      return;
    }
    
    console.log('✅ Admin user added successfully');
  }
  
  // Check if profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, name')
    .eq('email', adminEmail)
    .single();
  
  if (profile) {
    console.log('✅ Admin profile found:', profile.name || profile.email);
  } else {
    console.log('⚠️  Admin profile not found. User needs to sign up first.');
    console.log('Please sign up with the admin email to create a profile.');
    
    // Let's also check what admin emails and profiles exist
    const { data: allAdmins } = await supabase
      .from('admins')
      .select('email');
    
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('email, name');
    
    console.log('📋 All admin emails:', allAdmins);
    console.log('📋 All profiles:', allProfiles);
  }
}

setupAdmin(); 
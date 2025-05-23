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

async function createAdminProfile() {
  try {
    console.log('🔧 Creating admin profile...');
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email: 'dominikos@myroomieapp.com',
        name: 'Dominikos Pritis'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating profile:', error);
      return;
    }

    console.log('✅ Admin profile created:', data);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createAdminProfile(); 
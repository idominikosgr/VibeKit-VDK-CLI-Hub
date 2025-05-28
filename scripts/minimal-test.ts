#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testInsert() {
  try {
    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    console.log('Profile:', profile);

    // Try a minimal insert
    const { data, error } = await supabase
      .from('documentation_pages')
      .insert({
        title: 'Test Page',
        slug: 'test-page',
        content: 'This is a test',
        status: 'published',
        visibility: 'public',
        content_type: 'markdown',
        author_id: profile?.id,
        last_edited_by: profile?.id,
        path: '/docs/test-page'
      })
      .select();

    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log('Success:', data);
    }

  } catch (error) {
    console.error('Catch error:', error);
  }
}

testInsert(); 
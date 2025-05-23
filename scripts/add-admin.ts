/**
 * Development script to add admin users
 * Usage: npx tsx scripts/add-admin.ts <email>
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../lib/supabase/database.types';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function addAdmin(email: string) {
  try {
    console.log(`Adding admin access for: ${email}`);
    
    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingAdmin) {
      console.log('✅ User is already an admin');
      return;
    }

    // Add admin
    const { error } = await supabase
      .from('admins')
      .insert({ email: email.toLowerCase() });

    if (error) {
      throw error;
    }

    console.log('✅ Admin access granted successfully!');
    console.log(`📧 ${email} can now access admin functions`);
    
  } catch (error) {
    console.error('❌ Error adding admin:', error);
    process.exit(1);
  }
}

async function listAdmins() {
  try {
    const { data: admins, error } = await supabase
      .from('admins')
      .select('email, added_at')
      .order('added_at', { ascending: false });

    if (error) {
      throw error;
    }

    console.log('\n📋 Current Admins:');
    console.log('==================');
    
    if (!admins || admins.length === 0) {
      console.log('No admins found');
      return;
    }

    admins.forEach((admin, index) => {
      const addedDate = admin.added_at ? new Date(admin.added_at).toLocaleDateString() : 'Unknown';
      console.log(`${index + 1}. ${admin.email} (added: ${addedDate})`);
    });
    
  } catch (error) {
    console.error('❌ Error listing admins:', error);
    process.exit(1);
  }
}

async function removeAdmin(email: string) {
  try {
    console.log(`Removing admin access for: ${email}`);
    
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('email', email.toLowerCase());

    if (error) {
      throw error;
    }

    console.log('✅ Admin access removed successfully!');
    
  } catch (error) {
    console.error('❌ Error removing admin:', error);
    process.exit(1);
  }
}

function showUsage() {
  console.log('\n🔧 Admin Management Script');
  console.log('===========================');
  console.log('Usage:');
  console.log('  npx tsx scripts/add-admin.ts add <email>     - Add admin access');
  console.log('  npx tsx scripts/add-admin.ts remove <email>  - Remove admin access');
  console.log('  npx tsx scripts/add-admin.ts list            - List all admins');
  console.log('');
  console.log('Examples:');
  console.log('  npx tsx scripts/add-admin.ts add dominikos@myroomieapp.com');
  console.log('  npx tsx scripts/add-admin.ts list');
  console.log('  npx tsx scripts/add-admin.ts remove dominikos@myroomieapp.com');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showUsage();
    process.exit(1);
  }

  const command = args[0];
  
  switch (command) {
    case 'add':
      if (args.length < 2) {
        console.error('❌ Email required for add command');
        showUsage();
        process.exit(1);
      }
      await addAdmin(args[1]);
      break;
      
    case 'remove':
      if (args.length < 2) {
        console.error('❌ Email required for remove command');
        showUsage();
        process.exit(1);
      }
      await removeAdmin(args[1]);
      break;
      
    case 'list':
      await listAdmins();
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      showUsage();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 
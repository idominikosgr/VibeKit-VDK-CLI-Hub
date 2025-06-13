#!/usr/bin/env tsx

/**
 * AI.rules Repository Sync Script
 * 
 * This script uses the existing GitHub sync service to sync rules 
 * from the external AI.rules repository:
 * https://github.com/idominikosgr/AI.rules
 * 
 * Usage:
 *   npm run sync-ai-rules
 *   npm run sync-ai-rules -- --dry-run
 */

import { syncRulesFromGitHub } from '../src/lib/services/github/github-sync.js';

// Parse command line arguments
const isDryRun = process.argv.includes('--dry-run');
const isForce = process.argv.includes('--force');

async function main() {
  try {
    console.log('🚀 Starting AI.rules Repository Sync');
    console.log('====================================');
    console.log(`Repository: https://github.com/idominikosgr/AI.rules`);
    console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`);
    console.log(`Force: ${isForce ? 'YES' : 'NO'}`);
    console.log('');

    // Run the GitHub sync
    const result = await syncRulesFromGitHub({
      logResults: true,
      force: isForce
    });

    console.log('');
    console.log('📊 Final Results:');
    console.log(`  ✅ Added: ${result.added}`);
    console.log(`  ♻️  Updated: ${result.updated}`);
    console.log(`  ❌ Errors: ${result.errors.length}`);
    console.log(`  ⏱️  Duration: ${result.duration}ms`);

    if (result.errors.length > 0) {
      console.log('');
      console.log('❌ Errors encountered:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.message}`);
      });
      
      process.exit(1);
    } else {
      console.log('');
      console.log('✅ Sync completed successfully!');
      process.exit(0);
    }

  } catch (error) {
    console.error('💥 Fatal error during sync:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 
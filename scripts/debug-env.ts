// Simple script to debug environment variables

console.log('Environment variables check:');
console.log('==========================');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'NOT SET'}`);
console.log(`NEXT_SUPABASE_SERVICE_ROLE_KEY: ${process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'NOT SET'}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'NOT SET'}`);
console.log(`GITHUB_TOKEN: ${process.env.GITHUB_TOKEN ? 'Set' : 'NOT SET'}`);
console.log(`GITHUB_REPO_OWNER: ${process.env.GITHUB_REPO_OWNER ? 'Set' : 'NOT SET'}`);
console.log(`GITHUB_REPO_NAME: ${process.env.GITHUB_REPO_NAME ? 'Set' : 'NOT SET'}`);
console.log('==========================');

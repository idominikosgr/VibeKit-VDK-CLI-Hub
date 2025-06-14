# Admin Dashboard & Rule Generator Guide

## 🔑 Admin Dashboard Access

### Prerequisites
1. **Authentication**: You must be logged in with a user account
2. **Admin Status**: Your email must be added to the admin table

### Adding Admin Users

#### Option 1: Using the Script (Recommended)
```bash
# Add yourself as admin (replace with your email)
npx tsx scripts/add-admin.ts add your-email@example.com

# List current admins
npx tsx scripts/add-admin.ts list

# Remove admin access
npx tsx scripts/add-admin.ts remove email@example.com
```

#### Option 2: Manual Database Entry
```sql
-- Connect to your Supabase database and run:
INSERT INTO public.admins (email) VALUES ('your-email@example.com');
```

### Accessing the Admin Dashboard

1. **Login**: First login to your account at `/auth/login`
2. **Navigate**: Go to `/admin` - you'll see the main admin dashboard
3. **Features Available**:
   - **Rule Synchronization** (`/admin/sync`) - Sync from GitHub, view logs
   - **User Management** (`/admin/users`) - *[Coming Soon]*
   - **Analytics** (`/admin/analytics`) - *[Coming Soon]*
   - **Content Management** (`/admin/content`) - *[Coming Soon]*
   - **System Settings** (`/admin/settings`) - *[Coming Soon]*
   - **Database Management** (`/admin/database`) - *[Coming Soon]*

### Admin Dashboard Features

#### Main Dashboard (`/admin`)
- 📊 **Quick Stats**: Rules count, categories count, user count, last sync
- 🎯 **Admin Actions**: Access to all admin functions
- ⚡ **Quick Actions**: Common tasks like sync rules, test wizard

#### Rule Sync Management (`/admin/sync`)
- ✅ **Manual Sync**: Trigger rule synchronization from GitHub
- 📈 **Sync Statistics**: View current database stats
- 📝 **Sync Logs**: Paginated history of all sync operations
- 🧹 **Cleanup Options**: Remove orphaned rules during sync

## 🧙‍♂️ Rule Generator Testing

### Accessing the Rule Generator
1. Navigate to `/setup`
2. Complete the multi-step wizard:
   - **Project Info**: Name and description
   - **Technology Stack**: Frameworks (React, Vue, etc.)
   - **Programming Languages**: TypeScript, JavaScript, etc.
   - **Development Tools**: ESLint, Prettier, Husky, etc.
   - **Environment Setup**: Node version, package manager, output format
   - **Review & Generate**: Preview and generate package

### Package Generation Options

#### Output Formats
- **Bash Script** (`bash`): Executable setup script
- **ZIP Archive** (`zip`): Complete file package with documentation
- **Config Files** (`config`): Individual configuration files

#### Testing Package Generation

##### Via Rule Generator UI
1. Go to `/setup`
2. Complete all steps
3. Click "Generate Package" in the final step
4. Download generated package

##### Via API (Development Testing)
```bash
# Test the generation API
curl -X GET http://localhost:3000/api/setup/generate

# Generate a test package
curl -X POST http://localhost:3000/api/setup/generate \
  -H "Content-Type: application/json" \
  -d '{
    "stackChoices": {"react": true, "nextjs": true},
    "languageChoices": {"typescript": true},
    "toolPreferences": {"eslint": true, "prettier": true},
    "environmentDetails": {"outputFormat": "bash", "nodeVersion": "18.0.0"}
  }'
```

### Rule Generator Features

#### Smart Rule Matching
- Rules are matched based on your technology stack
- Compatibility scoring prioritizes relevant rules
- Dependencies and conflicts are automatically resolved

#### Package Types
- **Bash Scripts**: Ready-to-run setup automation
- **Config Files**: Drop-in configuration files
- **ZIP Archives**: Complete project setup with documentation

#### Database Tracking
- All generated packages are logged
- Download statistics are tracked
- Packages expire after 7 days for cleanup

## 🛠 Development & Debugging

### Environment Variables Required
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub (for rule sync)
GITHUB_TOKEN=your_github_token
GITHUB_REPO_OWNER=idominikosgr
GITHUB_REPO_NAME=ai.rules
```

### Admin Authorization Flow
1. User authentication via Supabase Auth
2. Email lookup in `admins` table
3. Protected routes check admin status
4. Middleware handles unauthorized access

### Rule Generator Flow
1. Multi-step form collection
2. Rule matching algorithm
3. Package generation engine
4. Database logging
5. Download/cleanup management

## 📋 Admin Tasks Checklist

### Initial Setup
- [ ] Add admin users using script
- [ ] Test admin dashboard access
- [ ] Verify rule sync functionality
- [ ] Test Rule Generator generation

### Regular Maintenance
- [ ] Monitor sync logs for errors
- [ ] Check database growth
- [ ] Review generated package statistics
- [ ] Clean up expired packages

### Troubleshooting
- Check browser console for authentication errors
- Verify environment variables are set
- Ensure database migrations are applied
- Check Supabase logs for API errors

## 🚀 Quick Start

1. **Setup Admin Access**:
   ```bash
   npx tsx scripts/add-admin.ts add your-email@example.com
   ```

2. **Login and Access Dashboard**:
   - Go to `/auth/login`
   - After login, go to `/admin`

3. **Test Rule Sync**:
   - Click "Rule Synchronization"
   - Click "Sync Now"

4. **Test Rule Generator**:
   - Go to `/setup`
   - Complete wizard steps
   - Generate a test package

That's it! You now have full access to the admin functions and Rule Generator. 🎉 
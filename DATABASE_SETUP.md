# CodePilotRules Hub - Database Setup Guide

## Overview

The CodePilotRules Hub uses a clean, migration-based database structure with Supabase. This guide explains how to set up and manage the database schema.

## Database Structure

### Migration-Based Schema
- **Migration File**: `supabase/migrations/20250120000000_initial_schema.sql`
- **Seed Data**: `supabase/seed.sql`
- **Type Definitions**: `codepilotrules-hub/lib/supabase/database.types.ts`

### Core Tables

#### Content Management
- **`categories`** - Rule categories (Next.js, React, TypeScript, etc.)
- **`rules`** - Individual AI development rules with markdown content
- **`rule_versions`** - Version history for rules
- **`rule_compatibility`** - Technology compatibility matrix
- **`rule_dependencies`** - Rule relationships (requires, conflicts, enhances)

#### User Management
- **`profiles`** - User profile information
- **`collections`** - User-created rule collections
- **`collection_items`** - Rules within collections
- **`user_votes`** - User voting on rules
- **`admins`** - Admin user permissions

#### Business Logic (Wizard & Generation)
- **`wizard_configurations`** - User wizard setup choices
- **`generated_packages`** - Generated rule packages for download
- **`generation_templates`** - Output format templates
- **`sync_logs`** - GitHub synchronization tracking

## Setup Instructions

### 1. Fresh Database Setup

```bash
# Reset and apply migration
supabase db reset

# This will automatically:
# - Apply the migration from supabase/migrations/20250120000000_initial_schema.sql
# - Run seed data from supabase/seed.sql
```

### 2. Manual Setup (if needed)

If you need to manually apply the schema:

```bash
# Apply migration only
supabase db push

# Apply seed data
supabase db seed
```

### 3. Regenerate Types (after schema changes)

```bash
# Generate TypeScript types from current schema
supabase gen types typescript --linked > codepilotrules-hub/lib/supabase/database.types.ts
```

## Key Features

### Row Level Security (RLS)
- **Public Access**: Rules and categories are publicly readable
- **Anonymous Wizard**: Anonymous users can create wizard configurations and generate packages
- **User Data**: Users can only access their own profiles, collections, and votes
- **Admin Control**: Admin users can manage all rules and categories

### Database Functions
- **`is_admin()`** - Check if current user is admin
- **`vote_for_rule(rule_id)`** - Add user vote for a rule
- **`remove_rule_vote(rule_id)`** - Remove user vote
- **`increment_rule_downloads(rule_id)`** - Track rule downloads
- **`search_rules(query, category, tags)`** - Full-text search with filtering
- **`get_rules_by_category(slug)`** - Get rules for a specific category
- **`get_popular_rules(limit)`** - Get most popular rules

### Triggers
- **Auto-update timestamps** - Automatically update `updated_at` fields
- **Vote count sync** - Keep rule vote counts in sync with user_votes table
- **Content change tracking** - Update `last_updated` when rule content changes

## Admin Setup

### Default Admin User
The seed data creates a default admin user. **Update this before production:**

```sql
-- Replace the default admin email in supabase/seed.sql
INSERT INTO public.admins (email)
VALUES
  ('your-admin-email@example.com')  -- Replace with your actual email
ON CONFLICT (email) DO NOTHING;
```

### Adding Additional Admins

```sql
-- Add new admin users
INSERT INTO public.admins (email) VALUES ('new-admin@example.com');
```

## Development Workflow

### Schema Changes
1. Edit the migration file: `supabase/migrations/20250120000000_initial_schema.sql`
2. Update seed data if needed: `supabase/seed.sql`
3. Reset database: `supabase db reset`
4. Regenerate types: `supabase gen types typescript --linked > codepilotrules-hub/lib/supabase/database.types.ts`

### Production Deployment
1. Apply migration: `supabase db push`
2. Run seed data (if needed): `supabase db seed`
3. Verify setup with the verification queries in the migration file

## Verification

After setup, run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- admins
- categories
- collection_items
- collections
- generated_packages
- generation_templates
- profiles
- rule_compatibility
- rule_dependencies
- rule_versions
- rules
- sync_logs
- user_votes
- wizard_configurations

## Troubleshooting

### Common Issues

1. **Migration Fails**: Check that you have the latest Supabase CLI version
2. **Type Errors**: Regenerate types after any schema changes
3. **RLS Errors**: Ensure user is properly authenticated for protected operations
4. **Admin Access**: Verify admin email is correctly added to the `admins` table

### Reset Everything

```bash
# Complete reset (DESTRUCTIVE - will delete all data)
supabase db reset
```

This will apply the migration and seed data from scratch.

## File Structure

```
supabase/
├── migrations/
│   └── 20250120000000_initial_schema.sql  # Complete schema definition
├── seed.sql                               # Initial data
└── config.toml                           # Supabase configuration

codepilotrules-hub/lib/supabase/
└── database.types.ts                     # Generated TypeScript types
```

## Next Steps

After database setup:
1. Start the Supabase local development server: `supabase start`
2. Run the Next.js application: `npm run dev`
3. Test the wizard functionality: `http://localhost:3000/setup`
4. Verify admin access in Supabase Studio: `http://localhost:54323`
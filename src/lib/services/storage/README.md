# Storage Service Documentation

This directory contains the storage abstraction layer for handling file uploads and downloads in the Vibe Coding Rules Hub application.

## Architecture

The storage system uses a provider pattern that allows switching between different storage backends without changing application code.

```
StorageService (abstraction)
├── SupabaseStorageProvider (current)
├── AzureStorageProvider (future)
└── S3StorageProvider (future)
```

## Current Implementation: Supabase Storage

### Setup Required

1. **Apply Database Migrations**:
   ```bash
   cd vibecodingrules-hub
   supabase db reset
   ```

2. **Storage Bucket**: The `generated-packages` bucket is automatically created by the migration

3. **Environment**: No additional environment variables needed (uses existing Supabase config)

### Usage

```typescript
import { createStorageService } from '@/lib/services/storage/supabase-storage-provider';

// Upload a package
const storageService = await createStorageService();
const result = await storageService.uploadPackage('package-id', buffer, 'zip');
console.log(result.publicUrl); // Direct download URL

// Download a package
const packageData = await storageService.downloadPackage('packages/package-id.zip');

// Get signed URL (for secure downloads)
const signedUrl = await storageService.getSignedPackageUrl('packages/package-id.zip', 3600);
```

## Migration to Other Providers

### Switching to Azure Blob Storage

1. **Install Dependencies**:
   ```bash
   npm install @azure/storage-blob
   ```

2. **Uncomment Azure Implementation** in `azure-storage-provider.ts`

3. **Environment Variables**:
   ```env
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string
   AZURE_STORAGE_ACCOUNT_NAME=your_account_name
   ```

4. **Update Service Creation**:
   ```typescript
   import { AzureStorageProvider } from './azure-storage-provider';
   import { StorageService } from './storage-service';
   
   const provider = new AzureStorageProvider(
     process.env.AZURE_STORAGE_CONNECTION_STRING!,
     process.env.AZURE_STORAGE_ACCOUNT_NAME!
   );
   const storageService = new StorageService(provider);
   ```

### Benefits of Each Provider

| Provider | Best For | Pros | Cons |
|----------|----------|------|------|
| **Supabase** | MVP, Small-Medium Scale | Integrated auth, simple setup, cost-effective | Limited to Supabase ecosystem |
| **Azure Blob** | Enterprise, Microsoft Stack | Enterprise features, great scaling, analytics | Complex setup, separate auth |
| **AWS S3** | High Scale Production | Industry standard, massive ecosystem | Cost complexity, steep learning curve |

## File Structure

```
storage/
├── storage-service.ts          # Main abstraction interface
├── supabase-storage-provider.ts # Current implementation
├── azure-storage-provider.ts   # Future implementation
└── README.md                   # This documentation
```

## Security Considerations

- **Public Access**: Generated packages are publicly accessible via URL
- **Expiration**: Packages expire after 7 days and are cleaned up
- **File Size**: Limited to 50MB per package
- **Content Types**: Restricted to safe file types (zip, json, sh, txt)

## Monitoring & Cleanup

The system includes automatic cleanup of expired packages:

```sql
-- Cleanup old packages (runs via cron or admin action)
DELETE FROM generated_packages 
WHERE expires_at < NOW();
```

Storage files should be cleaned up correspondingly through the admin interface or automated jobs. 
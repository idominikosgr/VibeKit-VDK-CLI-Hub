/**
 * Supabase Storage Provider Implementation
 * Implements the StorageProvider interface using Supabase Storage
 */

import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';
import { StorageProvider, UploadOptions, UploadResult } from './storage-service';

export class SupabaseStorageProvider implements StorageProvider {
  private supabase: Awaited<ReturnType<typeof createDatabaseSupabaseClient>>;

  constructor(supabase: Awaited<ReturnType<typeof createDatabaseSupabaseClient>>) {
    this.supabase = supabase;
  }

  async uploadFile(bucket: string, path: string, file: Buffer, options?: UploadOptions): Promise<UploadResult> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: options?.contentType,
        metadata: options?.metadata,
        cacheControl: options?.cacheControl,
        upsert: true // Allow overwriting existing files
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    const publicUrl = this.getPublicUrl(bucket, data.path);

    return {
      path: data.path,
      publicUrl,
      size: file.length
    };
  }

  async downloadFile(bucket: string, path: string): Promise<Buffer> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }

    return Buffer.from(await data.arrayBuffer());
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }
}

/**
 * Factory function to create a configured storage service
 */
export async function createStorageService() {
  const supabase = await createDatabaseSupabaseClient();
  const provider = new SupabaseStorageProvider(supabase);
  
  // Import the StorageService class
  const { StorageService } = await import('./storage-service');
  return new StorageService(provider);
} 
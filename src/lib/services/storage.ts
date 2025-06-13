import { createBrowserSupabaseClient } from '@/lib/supabase/client'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export class StorageService {
  private supabase = createBrowserSupabaseClient()
  private bucket = 'editor-images'

  async uploadImage(file: File, userId?: string): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = userId ? `${userId}/${fileName}` : `public/${fileName}`

      // Upload file to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return { url: '', path: '', error: error.message }
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(data.path)

      return {
        url: urlData.publicUrl,
        path: data.path
      }
    } catch (error) {
      console.error('Storage service error:', error)
      return { 
        url: '', 
        path: '', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  async deleteImage(path: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([path])

      if (error) {
        console.error('Delete error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete service error:', error)
      return false
    }
  }

  async getImageUrl(path: string): Promise<string> {
    try {
      const { data } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(path)

      return data.publicUrl
    } catch (error) {
      console.error('Get URL error:', error)
      return ''
    }
  }

  // Helper method to validate image files
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.' 
      }
    }

    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: 'File size too large. Please upload images smaller than 5MB.' 
      }
    }

    return { valid: true }
  }
}

export const storageService = new StorageService() 
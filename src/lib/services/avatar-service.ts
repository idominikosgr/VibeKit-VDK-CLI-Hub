import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

export interface AvatarUploadResult {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

export interface AvatarGenerationOptions {
  initials?: string;
  backgroundColor?: string;
  textColor?: string;
  size?: number;
}

/**
 * Upload avatar image to Supabase storage
 */
export async function uploadAvatar(file: File, userId: string): Promise<AvatarUploadResult> {
  try {
    const supabase = createBrowserSupabaseClient();
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.'
      };
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File too large. Please upload an image smaller than 2MB.'
      };
    }

    // Create unique filename with timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

    // Delete old avatar if exists
    await deleteOldAvatar(userId);

    // Upload new avatar
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: 'Failed to upload image. Please try again.'
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return {
        success: false,
        error: 'Failed to update profile. Please try again.'
      };
    }

    return {
      success: true,
      avatarUrl: publicUrl
    };

  } catch (error) {
    console.error('Avatar upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
}

/**
 * Delete old avatar from storage
 */
async function deleteOldAvatar(userId: string): Promise<void> {
  try {
    const supabase = createBrowserSupabaseClient();
    
    // List all files in user's folder
    const { data: files } = await supabase.storage
      .from('avatars')
      .list(userId);

    if (files && files.length > 0) {
      // Delete all existing avatar files
      const filePaths = files.map(file => `${userId}/${file.name}`);
      await supabase.storage
        .from('avatars')
        .remove(filePaths);
    }
  } catch (error) {
    console.error('Error deleting old avatar:', error);
    // Don't throw error, just log it
  }
}

/**
 * Generate avatar from initials using DiceBear API
 */
export function generateAvatarFromInitials(initials: string, options: AvatarGenerationOptions = {}): string {
  const {
    backgroundColor = 'random',
    textColor = 'white',
    size = 200
  } = options;

  // Use DiceBear API for consistent avatar generation
  const params = new URLSearchParams({
    seed: initials,
    backgroundColor: backgroundColor,
    scale: '80',
    radius: '50',
    size: size.toString()
  });

  return `https://api.dicebear.com/7.x/initials/svg?${params.toString()}`;
}

/**
 * Get user's current avatar URL or generate one from initials
 */
export async function getUserAvatar(userId: string): Promise<string> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url, name')
      .eq('id', userId)
      .single();

    if (profile?.avatar_url) {
      return profile.avatar_url;
    }

    // Generate avatar from initials if no avatar exists
    const initials = profile?.name 
      ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';

    return generateAvatarFromInitials(initials);

  } catch (error) {
    console.error('Error getting user avatar:', error);
    return generateAvatarFromInitials('U');
  }
}

/**
 * Remove avatar and reset to generated one
 */
export async function removeAvatar(userId: string): Promise<AvatarUploadResult> {
  try {
    const supabase = createBrowserSupabaseClient();

    // Delete avatar from storage
    await deleteOldAvatar(userId);

    // Update profile to remove avatar URL
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', userId);

    if (error) {
      return {
        success: false,
        error: 'Failed to remove avatar. Please try again.'
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Error removing avatar:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
} 
'use client';

import { useState, useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { uploadAvatar, removeAvatar, generateAvatarFromInitials, AvatarUploadResult } from '@/lib/services/avatar-service';
import { UploadIcon, CameraIcon, TrashIcon, ArrowsClockwiseIcon, UserIcon, SparkleIcon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  userName?: string;
  onAvatarUpdate?: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUpload({ 
  userId, 
  currentAvatarUrl, 
  userName,
  onAvatarUpdate,
  size = 'lg'
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  const initials = userName 
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreviewUrl(previewUrl);

    setIsUploading(true);
    
    try {
      const result: AvatarUploadResult = await uploadAvatar(file, userId);
      
      if (result.success && result.avatarUrl) {
        setAvatarUrl(result.avatarUrl);
        setPreviewUrl(null);
        onAvatarUpdate?.(result.avatarUrl);
        toast.success("Avatar uploaded successfully", {
          description: "Your profile picture has been updated.",
        });
      } else {
        setPreviewUrl(null);
        toast.error(result.error || "Failed to upload avatar.");
      }
    } catch (error) {
      setPreviewUrl(null);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  }, [userId, onAvatarUpdate]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      toast.error("Please drop an image file.");
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    
    try {
      const result = await removeAvatar(userId);
      
      if (result.success) {
        setAvatarUrl('');
        setPreviewUrl(null);
        onAvatarUpdate?.('');
        toast.success("Avatar removed", {
          description: "Your profile picture has been removed.",
        });
      } else {
        toast.error(result.error || "Failed to remove avatar.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateNew = () => {
    const newAvatarUrl = generateAvatarFromInitials(initials, {
      backgroundColor: 'random',
      size: 200
    });
    setAvatarUrl(newAvatarUrl);
    onAvatarUpdate?.(newAvatarUrl);
    toast.success("Avatar generated", {
      description: "A new avatar has been generated from your initials.",
    });
  };

  return (
    <Card className="bg-linear-to-br from-card/50 to-muted/30 dark:from-card/50 dark:to-muted/30 backdrop-blur-sm border-2 border-border/20 shadow-xl">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Avatar className={`${sizeClasses[size]} border-4 border-primary/20 shadow-lg`}>
                  <AvatarImage 
                    src={previewUrl || avatarUrl || generateAvatarFromInitials(initials)} 
                    alt={userName || 'User avatar'}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-linear-to-br from-primary to-accent text-primary-foreground text-lg font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              {(isUploading || previewUrl) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center"
                >
                  <ArrowsClockwiseIcon className="w-6 h-6 animate-spin text-primary" />
                </motion.div>
              )}
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-foreground">{userName || 'User'}</h3>
              <p className="text-sm text-muted-foreground">
                {avatarUrl ? 'Custom avatar' : 'Generated avatar'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Upload Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center gap-2">
              <CameraIcon className="w-4 h-4" />
              Upload Photo
            </Label>
            
            <motion.div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
                isDragOver 
                  ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isDragOver ? (
                  <motion.div
                    key="drag"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <UploadIcon className="w-8 h-8 mx-auto text-primary" />
                    <p className="text-sm font-medium text-primary">Drop image here</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="normal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <UploadIcon className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload or drag image here</p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, WebP, or GIF (max 2MB)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleGenerateNew}
              disabled={isUploading}
              className="w-full h-12 border-2 hover:bg-primary/5 dark:hover:bg-primary/10"
            >
              <SparkleIcon className="w-4 h-4 mr-2" />
              Generate New Avatar
            </Button>

            {avatarUrl && (
              <Button
                variant="outline"
                onClick={handleRemoveAvatar}
                disabled={isUploading}
                className="w-full h-12 border-2 border-destructive/50 text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/10"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Remove Avatar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
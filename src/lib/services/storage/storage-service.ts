/**
 * Storage Service Abstraction Layer
 * Provides a unified interface for file storage operations
 * Currently implements Supabase Storage with plans for Azure/AWS support
 */

export interface StorageProvider {
  uploadFile(bucket: string, path: string, file: Buffer, options?: UploadOptions): Promise<UploadResult>;
  downloadFile(bucket: string, path: string): Promise<Buffer>;
  deleteFile(bucket: string, path: string): Promise<void>;
  getPublicUrl(bucket: string, path: string): string;
  getSignedUrl(bucket: string, path: string, expiresIn?: number): Promise<string>;
}

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

export interface UploadResult {
  path: string;
  publicUrl: string;
  size: number;
}

export class StorageService {
  private provider: StorageProvider;

  constructor(provider: StorageProvider) {
    this.provider = provider;
  }

  /**
   * Upload a generated package file
   */
  async uploadPackage(packageId: string, content: Buffer, packageType: string): Promise<UploadResult> {
    const extension = this.getFileExtension(packageType);
    const path = `packages/${packageId}${extension}`;
    
    return this.provider.uploadFile('generated-packages', path, content, {
      contentType: this.getContentType(packageType),
      metadata: {
        packageType,
        uploadedAt: new Date().toISOString()
      },
      cacheControl: '3600' // Cache for 1 hour
    });
  }

  /**
   * Download a package file
   */
  async downloadPackage(packagePath: string): Promise<Buffer> {
    return this.provider.downloadFile('generated-packages', packagePath);
  }

  /**
   * Delete a package file (for cleanup)
   */
  async deletePackage(packagePath: string): Promise<void> {
    return this.provider.deleteFile('generated-packages', packagePath);
  }

  /**
   * Get public URL for a package
   */
  getPackageUrl(packagePath: string): string {
    return this.provider.getPublicUrl('generated-packages', packagePath);
  }

  /**
   * Get signed URL for secure downloads
   */
  async getSignedPackageUrl(packagePath: string, expiresIn: number = 3600): Promise<string> {
    return this.provider.getSignedUrl('generated-packages', packagePath, expiresIn);
  }

  /**
   * Helper methods
   */
  private getFileExtension(packageType: string): string {
    switch (packageType) {
      case 'bash':
        return '.sh';
      case 'zip':
        return '.zip';
      case 'config':
        return '.json';
      default:
        return '.txt';
    }
  }

  private getContentType(packageType: string): string {
    switch (packageType) {
      case 'bash':
        return 'application/x-sh';
      case 'zip':
        return 'application/zip';
      case 'config':
        return 'application/json';
      default:
        return 'text/plain';
    }
  }
} 
import { cacheDirectory, deleteAsync, downloadAsync, getInfoAsync, makeDirectoryAsync } from 'expo-file-system';

const VIDEO_CACHE_DIR = `${cacheDirectory}reels/`;

export class VideoCacheService {
  private initialized: boolean = false;

  constructor() {
    this.ensureDirExists();
  }

  private async ensureDirExists() {
    if (this.initialized) return;
    try {
      const dirInfo = await getInfoAsync(VIDEO_CACHE_DIR);
      if (!dirInfo.exists) {
        await makeDirectoryAsync(VIDEO_CACHE_DIR, { intermediates: true });
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error creating video cache directory:', error);
    }
  }

  public async getLocalUri(remoteUri: string): Promise<string | null> {
    await this.ensureDirExists();
    
    const fileName = this.getFileName(remoteUri);
    const localUri = `${VIDEO_CACHE_DIR}${fileName}`;
    
    try {
      const fileInfo = await getInfoAsync(localUri);
      if (fileInfo.exists) {
        return localUri;
      }
      return null;
    } catch (error) {
      console.error('Error checking local file:', error);
      return null;
    }
  }

  public async cacheVideo(remoteUri: string): Promise<string | null> {
    await this.ensureDirExists();
    
    const fileName = this.getFileName(remoteUri);
    const localUri = `${VIDEO_CACHE_DIR}${fileName}`;
    
    try {
      const fileInfo = await getInfoAsync(localUri);
      if (fileInfo.exists) {
        return localUri;
      }

      console.log(`Downloading video: ${remoteUri} to ${localUri}`);
      const downloadRes = await downloadAsync(remoteUri, localUri);
      
      if (downloadRes.status === 200) {
        return downloadRes.uri;
      }
      return null;
    } catch (error) {
      console.error('Error caching video:', error);
      return null;
    }
  }

  private getFileName(uri: string): string {
    // Create a simple hash or use the last part of the URL
    const parts = uri.split('/');
    const name = parts[parts.length - 1];
    // Ensure it has a filename and doesn't contain invalid characters
    return name.split('?')[0] || `video_${Date.now()}.mp4`;
  }

  public async clearCache() {
    try {
      await deleteAsync(VIDEO_CACHE_DIR, { idempotent: true });
      await this.ensureDirExists();
    } catch (error) {
      console.error('Error clearing video cache:', error);
    }
  }
}

export const videoCacheService = new VideoCacheService();

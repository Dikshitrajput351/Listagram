import * as Crypto from 'expo-crypto';
import { Reel } from '../types';
import { meshNetworkService } from './MeshNetworkService';
import { videoCacheService } from './VideoCacheService';

// Mock data service - in production, would connect to backend
export class ReelDataService {
  private reels: Map<string, Reel> = new Map();
  private cachedReels: Reel[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock reels for demo
    const mockReels: Reel[] = [
      {
        id: Crypto.randomUUID(),
        userId: 'user1',
        userName: 'Ahmed Khan',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        title: 'Beautiful Sunset',
        description: 'Amazing sunset at the beach 🌅',
        likes: 1230,
        comments: 45,
        shares: 12,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: Crypto.randomUUID(),
        userId: 'user2',
        userName: 'Fatima Ahmed',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        title: 'Travel Vlog',
        description: 'Exploring the city ✨',
        likes: 890,
        comments: 34,
        shares: 8,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: Crypto.randomUUID(),
        userId: 'user3',
        userName: 'Hassan Ali',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
        title: 'Food Preparation',
        description: 'Making traditional biryani 🍛',
        likes: 2100,
        comments: 67,
        shares: 23,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
    ];

    mockReels.forEach((reel) => {
      this.reels.set(reel.id, reel);
    });
    this.cachedReels = mockReels;
  }

  public async getReels(limit: number = 10, offset: number = 0): Promise<Reel[]> {
    try {
      const canConnect = await meshNetworkService.checkConnectivity();
      const currentReels = this.cachedReels.slice(offset, offset + limit);
      
      // Try to get local URIs for all reels
      const reelsWithCache = await Promise.all(
        currentReels.map(async (reel) => {
          const localUri = await videoCacheService.getLocalUri(reel.videoUrl);
          return { ...reel, localVideoUrl: localUri || undefined };
        })
      );

      // Trigger background caching for those not cached yet
      if (canConnect) {
        this.triggerBackgroundCaching(currentReels);
      }
      
      return reelsWithCache;
    } catch (error) {
      console.error('Error getting reels:', error);
      return this.cachedReels.slice(offset, offset + limit);
    }
  }

  private async triggerBackgroundCaching(reels: Reel[]) {
    // Only cache if online
    const isOnline = (await meshNetworkService.getNetworkStatus()).isOnline;
    if (!isOnline) return;

    for (const reel of reels) {
      try {
        const localUri = await videoCacheService.cacheVideo(reel.videoUrl);
        if (localUri) {
          reel.localVideoUrl = localUri;
          // Update the map
          const existing = this.reels.get(reel.id);
          if (existing) {
            existing.localVideoUrl = localUri;
          }
        }
      } catch (e) {
        console.error(`Failed to background cache reel ${reel.id}:`, e);
      }
    }
  }

  private getReelsFromMesh(limit: number, offset: number): Reel[] {
    return this.cachedReels.slice(offset, offset + limit);
  }

  public async likeReel(reelId: string): Promise<void> {
    const reel = this.reels.get(reelId);
    if (reel) {
      reel.likes += 1;
      reel.liked = true;
    }
  }

  public async unlikeReel(reelId: string): Promise<void> {
    const reel = this.reels.get(reelId);
    if (reel) {
      reel.likes = Math.max(0, reel.likes - 1);
      reel.liked = false;
    }
  }

  public async addReel(reel: Omit<Reel, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>): Promise<Reel> {
    const newReel: Reel = {
      ...reel,
      id: Crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
    };
    
    this.reels.set(newReel.id, newReel);
    this.cachedReels.unshift(newReel);
    
    return newReel;
  }

  public getCachedReels(): Reel[] {
    return this.cachedReels;
  }
}

export const reelDataService = new ReelDataService();


// Video Reel Types
export interface Reel {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  videoUrl: string;
  localVideoUrl?: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  liked?: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  messages: Message[];
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

// Mesh Network Types
export interface MeshNode {
  id: string;
  deviceName: string;
  ipAddress: string;
  port: number;
  lastSeen: number;
  isConnected: boolean;
}

export interface MeshMessage {
  id: string;
  type: 'sync' | 'request' | 'response' | 'broadcast';
  payload: any;
  senderId: string;
  timestamp: number;
}

export interface NetworkStatus {
  isOnline: boolean;
  isConnectedToMesh: boolean;
  connectedNodes: number;
  meshNodeId: string;
}

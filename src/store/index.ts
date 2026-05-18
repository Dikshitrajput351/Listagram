import { create } from 'zustand';
import { meshNetworkService } from '../services/MeshNetworkService';
import { messageService } from '../services/MessageService';
import { reelDataService } from '../services/ReelDataService';
import { Conversation, NetworkStatus, Reel, User } from '../types';

interface ListagramStore {
  // Reel state
  reels: Reel[];
  currentReelIndex: number;
  isLoadingReels: boolean;

  // Network state
  networkStatus: NetworkStatus;

  // Follow / user state
  currentUser: User;
  accounts: User[];
  users: User[];
  followingIds: string[];

  // Messaging state
  conversations: Conversation[];
  currentConversationId: string | null;
  messageDraft: string;

  // Upload state
  isUploading: boolean;
  isRegistered: boolean;
  stories: User[];

  // Actions
  loadReels: (limit?: number) => Promise<void>;
  setRegistered: (status: boolean) => void;
  setCurrentReelIndex: (index: number) => void;
  likeReel: (reelId: string) => Promise<void>;
  unlikeReel: (reelId: string) => Promise<void>;
  updateNetworkStatus: (status: NetworkStatus) => void;
  refreshReels: () => Promise<void>;
  toggleFollowUser: (userId: string) => void;
  switchAccount: (userId: string) => void;
  createAccount: (name: string) => void;
  startConversation: (participantId: string) => void;
  setCurrentConversationId: (conversationId: string | null) => void;
  setMessageDraft: (text: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  addNewReel: (reel: Omit<Reel, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>) => Promise<void>;
}

export const useListagramStore = create<ListagramStore>((set, get) => ({
  reels: [],
  currentReelIndex: 0,
  isLoadingReels: false,
  networkStatus: {
    isOnline: false,
    isConnectedToMesh: false,
    connectedNodes: 0,
    meshNodeId: '',
  },
  currentUser: messageService.getCurrentUser(),
  accounts: messageService.getAccounts(),
  users: messageService.getUsers(),
  followingIds: [],
  conversations: messageService.getConversations(),
  currentConversationId: null,
  messageDraft: '',
  isUploading: false,
  isRegistered: false,
  stories: messageService.getUsers(),

  loadReels: async (limit = 10) => {
    set({ isLoadingReels: true });
    try {
      const reels = await reelDataService.getReels(limit);
      set({ reels: reels || [], isLoadingReels: false });
    } catch (error) {
      console.error('Failed to load reels:', error);
      set({ reels: [], isLoadingReels: false });
    }
  },

  setRegistered: (status: boolean) => {
    set({ isRegistered: status });
  },

  setCurrentReelIndex: (index: number) => {
    set({ currentReelIndex: index });
  },

  likeReel: async (reelId: string) => {
    await reelDataService.likeReel(reelId);
    const reels = get().reels.map((reel) =>
      reel.id === reelId ? { ...reel, liked: true, likes: reel.likes + 1 } : reel
    );
    set({ reels });
  },

  unlikeReel: async (reelId: string) => {
    await reelDataService.unlikeReel(reelId);
    const reels = get().reels.map((reel) =>
      reel.id === reelId ? { ...reel, liked: false, likes: Math.max(0, reel.likes - 1) } : reel
    );
    set({ reels });
  },

  updateNetworkStatus: (status: NetworkStatus) => {
    set({ networkStatus: status });
  },

  refreshReels: async () => {
    await get().loadReels();
  },

  switchAccount: (userId: string) => {
    const selectedUser = messageService.setCurrentUser(userId);
    if (!selectedUser) {
      return;
    }

    set({
      currentUser: selectedUser,
      accounts: messageService.getAccounts(),
      users: messageService.getUsers(),
    });
  },

  createAccount: (name: string) => {
    const newUser = messageService.createAccount(name);
    set({
      currentUser: newUser,
      accounts: messageService.getAccounts(),
      users: messageService.getUsers(),
    });
  },

  toggleFollowUser: (userId: string) => {
    const isAlreadyFollowing = get().followingIds.includes(userId);
    const followingIds = isAlreadyFollowing
      ? get().followingIds.filter((id) => id !== userId)
      : [...get().followingIds, userId];

    const updateFollowers = (user: User) =>
      user.id === userId
        ? {
            ...user,
            followers: isAlreadyFollowing ? Math.max(0, user.followers - 1) : user.followers + 1,
            isFollowing: !isAlreadyFollowing,
          }
        : user;

    set({
      followingIds,
      users: get().users.map(updateFollowers),
      accounts: get().accounts.map(updateFollowers),
    });
  },

  startConversation: (participantId: string) => {
    const conversation = messageService.createConversation(participantId);
    set({
      conversations: [conversation, ...get().conversations.filter((item) => item.id !== conversation.id)],
      currentConversationId: conversation.id,
      messageDraft: '',
    });
  },

  setCurrentConversationId: (conversationId: string | null) => {
    set({ currentConversationId: conversationId, messageDraft: '' });
  },

  setMessageDraft: (text: string) => {
    set({ messageDraft: text });
  },

  sendMessage: (conversationId: string, text: string) => {
    const updatedConversation = messageService.sendMessage(conversationId, text);
    if (!updatedConversation) {
      return;
    }
    set({
      conversations: [
        updatedConversation,
        ...get().conversations.filter((item) => item.id !== updatedConversation.id),
      ],
      messageDraft: '',
    });
  },

  addNewReel: async (reel) => {
    set({ isUploading: true });
    try {
      const newReel = await reelDataService.addReel(reel);
      set({ reels: [newReel, ...get().reels], isUploading: false });
    } catch (error) {
      console.error('Failed to upload reel:', error);
      set({ isUploading: false });
    }
  },
}));

// Subscribe to mesh network status changes
let meshSubscriptionInitialized = false;

export const initializeMeshSubscription = () => {
  if (meshSubscriptionInitialized) return;
  meshSubscriptionInitialized = true;
  
  setTimeout(() => {
    try {
      meshNetworkService.subscribe((status) => {
        try {
          useListagramStore.setState({ networkStatus: status });
        } catch (e) {
          console.error('Error updating network status:', e);
        }
      });
    } catch (e) {
      console.error('Error subscribing to mesh network:', e);
    }
  }, 1000);
};

import { create } from 'zustand';
import { meshNetworkService } from '../services/MeshNetworkService';
import { messageService } from '../services/MessageService';
import { reelDataService } from '../services/ReelDataService';
import { Conversation, NetworkStatus, Notification, Reel, User } from '../types';

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

  // Notifications state
  notifications: Notification[];

  // Upload state
  isUploading: boolean;
  isRegistered: boolean;
  isLoggedIn: boolean;
  stories: User[];

  // Actions
  loadReels: (limit?: number) => Promise<void>;
  setRegistered: (status: boolean) => void;
  setLoggedIn: (status: boolean) => void;
  setCurrentReelIndex: (index: number) => void;
  likeReel: (reelId: string) => Promise<void>;
  unlikeReel: (reelId: string) => Promise<void>;
  updateNetworkStatus: (status: NetworkStatus) => void;
  refreshReels: () => Promise<void>;
  toggleFollowUser: (userId: string) => void;
  switchAccount: (userId: string) => void;
  createAccount: (name: string) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  startConversation: (participantId: string) => void;
  setCurrentConversationId: (conversationId: string | null) => void;
  setMessageDraft: (text: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  addNewReel: (reel: Omit<Reel, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares'>) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markNotificationsAsRead: () => void;
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
  notifications: [
    {
      id: '1',
      type: 'follow',
      userId: 'user-2',
      userName: 'Alex Rivers',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'like',
      userId: 'user-3',
      userName: 'Sam Smith',
      reelId: 'reel-1',
      reelTitle: 'Morning Coffee',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    }
  ],
  isUploading: false,
  isRegistered: false,
  isLoggedIn: false,
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

  setLoggedIn: (status: boolean) => {
    set({ isLoggedIn: status });
  },

  setCurrentReelIndex: (index: number) => {
    set({ currentReelIndex: index });
  },

  likeReel: async (reelId: string) => {
    await reelDataService.likeReel(reelId);
    const reel = get().reels.find(r => r.id === reelId);
    const reels = get().reels.map((reel) =>
      reel.id === reelId ? { ...reel, liked: true, likes: reel.likes + 1 } : reel
    );
    set({ reels });

    // Simulation: Add a notification if someone else's reel was liked
    if (reel && reel.userId !== get().currentUser.id) {
      get().addNotification({
        id: Math.random().toString(36).substr(2, 9),
        type: 'like',
        userId: 'some-user-id',
        userName: 'Someone',
        reelId: reel.id,
        reelTitle: reel.title,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }
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

  login: async (email, _password) => {
    // Mock login logic: check if user exists by email/name
    const users = get().users;
    const existingUser = users.find(u => u.id === email || u.name.toLowerCase().includes(email.toLowerCase()));
    
    if (existingUser) {
      set({ 
        currentUser: existingUser,
        isLoggedIn: true,
        isRegistered: true 
      });
      return true;
    }
    return false;
  },

  signup: async (name, email, _password) => {
    // Mock signup logic: create a new account
    const newUser = messageService.createAccount(name);
    set({
      currentUser: newUser,
      isLoggedIn: true,
      isRegistered: true,
      accounts: messageService.getAccounts(),
      users: messageService.getUsers(),
    });
    return true;
  },

  toggleFollowUser: (userId: string) => {
    const isAlreadyFollowing = get().followingIds.includes(userId);
    const followingIds = isAlreadyFollowing
      ? get().followingIds.filter((id) => id !== userId)
      : [...get().followingIds, userId];

    const targetUser = get().users.find(u => u.id === userId);

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

    // Simulation: If I follow someone, show a follow notification for demo
    if (!isAlreadyFollowing && targetUser) {
      get().addNotification({
        id: Math.random().toString(36).substr(2, 9),
        type: 'follow',
        userId: targetUser.id,
        userName: targetUser.name,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }
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

  addNotification: (notification) => {
    set({ notifications: [notification, ...get().notifications] });
  },

  markNotificationsAsRead: () => {
    set({
      notifications: get().notifications.map(n => ({ ...n, read: true }))
    });
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

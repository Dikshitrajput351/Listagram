import * as Crypto from 'expo-crypto';
import { Conversation, Message, User } from '../types';

export class MessageService {
  private currentUser: User;
  private users: User[];
  private conversations: Conversation[] = [];

  constructor() {
    this.currentUser = {
      id: 'currentUser',
      name: 'You',
      avatar: '',
      bio: 'Capturing life, one reel at a time.',
      followers: 128,
      following: 84,
    };

    this.users = [
      {
        id: 'user1',
        name: 'Ahmed Khan',
        avatar: '',
        bio: 'Travel & lifestyle creator',
        followers: 1870,
        following: 240,
      },
      {
        id: 'user2',
        name: 'Fatima Ahmed',
        avatar: '',
        bio: 'Music, food and stories',
        followers: 965,
        following: 112,
      },
      {
        id: 'user3',
        name: 'Hassan Ali',
        avatar: '',
        bio: 'Creator of viral short videos',
        followers: 4300,
        following: 530,
      },
    ];

    this.initializeMockConversations();
  }

  private initializeMockConversations() {
    this.conversations = [
      {
        id: Crypto.randomUUID(),
        participantId: this.users[0].id,
        participantName: this.users[0].name,
        participantAvatar: this.users[0].avatar,
        messages: [
          this.createMessage(this.users[0].id, 'Hey! Loved your reel — can we collaborate?'),
          this.createMessage(this.currentUser.id, 'Thank you! Yes, let’s chat details.'),
        ],
        lastMessage: 'Thank you! Yes, let’s chat details.',
        updatedAt: new Date().toISOString(),
        unreadCount: 0,
      },
      {
        id: Crypto.randomUUID(),
        participantId: this.users[1].id,
        participantName: this.users[1].name,
        participantAvatar: this.users[1].avatar,
        messages: [
          this.createMessage(this.users[1].id, 'Your upload looks amazing!'),
        ],
        lastMessage: 'Your upload looks amazing!',
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 1,
      },
    ];
  }

  private createMessage(senderId: string, text: string): Message {
    return {
      id: Crypto.randomUUID(),
      senderId,
      text,
      timestamp: new Date().toISOString(),
    };
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getAccounts(): User[] {
    return [this.currentUser, ...this.users];
  }

  public setCurrentUser(userId: string): User | undefined {
    if (this.currentUser.id === userId) {
      return this.currentUser;
    }

    const selected = this.users.find((user) => user.id === userId);
    if (selected) {
      this.currentUser = selected;
      return this.currentUser;
    }

    return undefined;
  }

  public createAccount(name: string): User {
    const newUser: User = {
      id: Crypto.randomUUID(),
      name,
      avatar: '',
      bio: `Creator ${name}`,
      followers: 0,
      following: 0,
    };

    this.users.unshift(newUser);
    this.currentUser = newUser;
    return this.currentUser;
  }

  public getConversations(): Conversation[] {
    return this.conversations;
  }

  public getConversationById(conversationId: string): Conversation | undefined {
    return this.conversations.find((conversation) => conversation.id === conversationId);
  }

  public createConversation(participantId: string): Conversation {
    const existing = this.conversations.find((conversation) => conversation.participantId === participantId);
    if (existing) {
      return existing;
    }

    const participant = this.users.find((user) => user.id === participantId);
    const conversation: Conversation = {
      id: Crypto.randomUUID(),
      participantId,
      participantName: participant?.name || 'Unknown',
      participantAvatar: participant?.avatar || '',
      messages: [
        this.createMessage(participantId, 'Hi there! This is a new chat.'),
      ],
      lastMessage: 'Hi there! This is a new chat.',
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    };

    this.conversations.unshift(conversation);
    return conversation;
  }

  public sendMessage(conversationId: string, text: string): Conversation | undefined {
    const conversation = this.getConversationById(conversationId);
    if (!conversation) {
      return undefined;
    }

    const message = this.createMessage(this.currentUser.id, text);
    conversation.messages.push(message);
    conversation.lastMessage = text;
    conversation.updatedAt = new Date().toISOString();
    conversation.unreadCount = 0;
    return conversation;
  }

  public toggleFollow(userId: string): User | undefined {
    const user = this.users.find((item) => item.id === userId);
    if (!user) {
      return undefined;
    }

    return user;
  }
}

export const messageService = new MessageService();


import * as Network from 'expo-network';
import * as Crypto from 'expo-crypto';
import { MeshMessage, MeshNode, NetworkStatus } from '../types';

const MESH_BROADCAST_INTERVAL = 5000; // 5 seconds

export class MeshNetworkService {
  private nodeId: string = Crypto.randomUUID();
  private meshNodes: Map<string, MeshNode> = new Map();
  private listeners: ((status: NetworkStatus) => void)[] = [];
  private isOnline: boolean = false;
  private broadcastTimer: ReturnType<typeof setInterval> | null = null;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;
  private initResolve: (() => void) | null = null;

  constructor() {
    this.initPromise = new Promise((resolve) => {
      this.initResolve = resolve;
      setTimeout(async () => {
        await this.initializeNetwork();
        resolve();
      }, 100);
    });
  }

  private async initializeNetwork() {
    if (this.initialized) return;
    this.initialized = true;
    
    try {
      const networkState = await Network.getNetworkStateAsync();
      this.isOnline = networkState.isConnected ?? false;
      this.notifyListeners();
      this.startMeshBroadcast();
    } catch (error) {
      console.error('Network initialization failed:', error);
      this.isOnline = false;
      this.notifyListeners();
    }
  }

  private async ensureInitialized() {
    if (this.initPromise) {
      try {
        await this.initPromise;
      } catch (e) {
        console.error('Error during init:', e);
      }
    }
  }

  private startMeshBroadcast() {
    if (this.broadcastTimer) {
      clearInterval(this.broadcastTimer);
    }
    this.broadcastTimer = setInterval(() => {
      this.broadcastNodePresence();
    }, MESH_BROADCAST_INTERVAL);
  }

  private broadcastNodePresence() {
    // Simulate mesh network broadcast - in production use actual P2P library
    const message: MeshMessage = {
      id: Crypto.randomUUID(),
      type: 'broadcast',
      senderId: this.nodeId,
      payload: {
        nodeId: this.nodeId,
        timestamp: Date.now(),
        deviceName: 'Listagram User',
      },
      timestamp: Date.now(),
    };

    // Broadcast to all known mesh nodes
    this.meshNodes.forEach((node) => {
      this.sendMessageToNode(node, message);
    });

    this.notifyListeners();
  }

  private async sendMessageToNode(node: MeshNode, message: MeshMessage) {
    try {
      // Simulate network message sending
      console.log(`Sending message to ${node.deviceName}:`, message);
      node.lastSeen = Date.now();
    } catch (error) {
      console.error(`Failed to send message to ${node.id}:`, error);
      node.isConnected = false;
    }
  }

  public addNode(node: MeshNode) {
    this.meshNodes.set(node.id, {
      ...node,
      lastSeen: Date.now(),
      isConnected: true,
    });
    this.notifyListeners();
  }

  public removeNode(nodeId: string) {
    this.meshNodes.delete(nodeId);
    this.notifyListeners();
  }

  public getMeshNodes(): MeshNode[] {
    return Array.from(this.meshNodes.values());
  }

  public getNetworkStatus(): NetworkStatus {
    return {
      isOnline: this.isOnline,
      isConnectedToMesh: this.meshNodes.size > 0,
      connectedNodes: this.meshNodes.size,
      meshNodeId: this.nodeId,
    };
  }

  public subscribe(listener: (status: NetworkStatus) => void) {
    this.listeners.push(listener);
    // Notify immediately
    listener(this.getNetworkStatus());
    
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    const status = this.getNetworkStatus();
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (e) {
        console.error('Error calling network status listener:', e);
      }
    });
  }

  public async checkConnectivity(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      const networkState = await Network.getNetworkStateAsync();
      this.isOnline = networkState.isConnected ?? false;
      this.notifyListeners();
      return this.isOnline || this.meshNodes.size > 0;
    } catch (error) {
      console.error('Connectivity check failed:', error);
      return this.meshNodes.size > 0; // Can still use mesh if offline
    }
  }

  public destroy() {
    if (this.broadcastTimer) {
      clearInterval(this.broadcastTimer);
    }
  }
}

export const meshNetworkService = new MeshNetworkService();

/**
 * WebSocket Handler
 * 
 * Manages WebSocket connections and real-time communication
 */

import { WebSocketServer, WebSocket } from 'ws';
import { config } from '../config.js';

interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  id?: string;
}

interface WSMessage {
  type: string;
  data?: any;
  id?: string;
}

const clients = new Map<string, ExtendedWebSocket>();

/**
 * Setup WebSocket server
 */
export function setupWebSocket(wss: WebSocketServer): void {
  console.log('WebSocket server initialized');
  
  // Heartbeat to detect broken connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {
      const extWs = ws as ExtendedWebSocket;
      
      if (extWs.isAlive === false) {
        console.log(`Client ${extWs.id} is not alive, terminating`);
        if (extWs.id) {
          clients.delete(extWs.id);
        }
        return extWs.terminate();
      }
      
      extWs.isAlive = false;
      extWs.ping();
    });
  }, config.websocket.heartbeatInterval);
  
  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });
  
  // Handle new connections
  wss.on('connection', (ws: WebSocket) => {
    const extWs = ws as ExtendedWebSocket;
    const clientId = generateClientId();
    
    extWs.id = clientId;
    extWs.isAlive = true;
    clients.set(clientId, extWs);
    
    console.log(`Client ${clientId} connected. Total clients: ${clients.size}`);
    
    // Send welcome message
    sendToClient(extWs, {
      type: 'connection',
      data: {
        clientId,
        message: 'Connected to WebSocket server',
        timestamp: new Date().toISOString(),
      },
    });
    
    // Handle pong responses
    extWs.on('pong', () => {
      extWs.isAlive = true;
    });
    
    // Handle messages
    extWs.on('message', (message: Buffer) => {
      try {
        const data: WSMessage = JSON.parse(message.toString());
        handleMessage(extWs, data);
      } catch (error) {
        console.error('Failed to parse message:', error);
        sendError(extWs, 'Invalid message format');
      }
    });
    
    // Handle disconnection
    extWs.on('close', () => {
      console.log(`Client ${clientId} disconnected`);
      clients.delete(clientId);
    });
    
    // Handle errors
    extWs.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
    });
  });
}

/**
 * Handle incoming messages
 */
function handleMessage(ws: ExtendedWebSocket, message: WSMessage): void {
  console.log(`Message from ${ws.id}:`, message);
  
  switch (message.type) {
    case 'ping':
      sendToClient(ws, { type: 'pong', data: { timestamp: new Date().toISOString() } });
      break;
      
    case 'echo':
      sendToClient(ws, { type: 'echo', data: message.data });
      break;
      
    case 'broadcast':
      broadcast(message.data, ws.id);
      break;
      
    case 'subscribe':
      handleSubscribe(ws, message.data);
      break;
      
    case 'unsubscribe':
      handleUnsubscribe(ws, message.data);
      break;
      
    default:
      sendError(ws, `Unknown message type: ${message.type}`);
  }
}

/**
 * Send message to specific client
 */
function sendToClient(ws: ExtendedWebSocket, message: WSMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Send error to client
 */
function sendError(ws: ExtendedWebSocket, error: string): void {
  sendToClient(ws, {
    type: 'error',
    data: { error, timestamp: new Date().toISOString() },
  });
}

/**
 * Broadcast message to all clients except sender
 */
function broadcast(data: any, senderId?: string): void {
  const message: WSMessage = {
    type: 'broadcast',
    data: {
      ...data,
      from: senderId,
      timestamp: new Date().toISOString(),
    },
  };
  
  clients.forEach((client, clientId) => {
    if (clientId !== senderId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

/**
 * Handle subscription to channels
 */
function handleSubscribe(ws: ExtendedWebSocket, data: any): void {
  // Implementation for channel subscriptions
  console.log(`Client ${ws.id} subscribed to:`, data);
  sendToClient(ws, {
    type: 'subscribed',
    data: { channel: data.channel, timestamp: new Date().toISOString() },
  });
}

/**
 * Handle unsubscription from channels
 */
function handleUnsubscribe(ws: ExtendedWebSocket, data: any): void {
  // Implementation for channel unsubscriptions
  console.log(`Client ${ws.id} unsubscribed from:`, data);
  sendToClient(ws, {
    type: 'unsubscribed',
    data: { channel: data.channel, timestamp: new Date().toISOString() },
  });
}

/**
 * Generate unique client ID
 */
function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all connected clients
 */
export function getConnectedClients(): string[] {
  return Array.from(clients.keys());
}

/**
 * Send message to specific client by ID
 */
export function sendToClientById(clientId: string, message: WSMessage): boolean {
  const client = clients.get(clientId);
  
  if (client) {
    sendToClient(client, message);
    return true;
  }
  
  return false;
}

/**
 * Broadcast to all clients
 */
export function broadcastToAll(message: WSMessage): void {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// ============================================================================
// SCHOLAR API SERVER
// Main Express server with Socket.IO for real-time chat
// ============================================================================

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chat.js';
import discoveryRoutes from './routes/discovery.js';
import studyGroupRoutes from './routes/studyGroups.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/studygroups', studyGroupRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ============================================================================
// SOCKET.IO REAL-TIME CHAT
// ============================================================================

// Store connected users: userId -> socketId
const connectedUsers = new Map();

// Socket.IO authentication middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      console.log('❌ Socket connection rejected: No token provided');
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    socket.userId = decoded.sub; // Use 'sub' to match JWT structure
    socket.userName = decoded.name || decoded.email || 'User';
    
    console.log(`✅ Socket authenticated: ${socket.userName} (${socket.userId})`);
    next();
  } catch (error) {
    console.log('❌ Socket authentication failed:', error.message);
    next(new Error('Invalid authentication token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  const userName = socket.userName;
  
  console.log(`🔌 User connected: ${userName} (Socket ID: ${socket.id})`);
  
  // Store user connection
  connectedUsers.set(userId, socket.id);
  
  // Broadcast user online status
  io.emit('user:online', { userId, online: true });
  
  // Join user's personal room
  socket.join(`user:${userId}`);
  
  // Handle joining conversation rooms
  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`📝 ${userName} joined conversation: ${conversationId}`);
  });
  
  // Handle leaving conversation rooms
  socket.on('conversation:leave', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`👋 ${userName} left conversation: ${conversationId}`);
  });
  
  // Handle sending messages
  socket.on('message:send', async (data) => {
    const { conversationId, receiverId, content, tempId } = data;
    
    console.log(`💬 Message from ${userName} to ${receiverId}: "${content.substring(0, 50)}..."`);
    
    try {
      // The actual message saving will be done via HTTP API
      // Here we just emit the message to the receiver in real-time
      
      // Emit to conversation room
      io.to(`conversation:${conversationId}`).emit('message:new', {
        conversationId,
        senderId: userId,
        receiverId,
        content,
        tempId,
        createdAt: new Date().toISOString()
      });
      
      // Also emit to receiver's personal room for notifications
      io.to(`user:${receiverId}`).emit('message:notification', {
        conversationId,
        senderId: userId,
        senderName: userName,
        content
      });
      
      console.log(`✅ Message delivered to conversation ${conversationId}`);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      socket.emit('message:error', { 
        tempId, 
        error: 'Failed to send message' 
      });
    }
  });
  
  // Handle typing indicators
  socket.on('typing:start', ({ conversationId, receiverId }) => {
    io.to(`user:${receiverId}`).emit('typing:start', {
      conversationId,
      userId,
      userName
    });
  });
  
  socket.on('typing:stop', ({ conversationId, receiverId }) => {
    io.to(`user:${receiverId}`).emit('typing:stop', {
      conversationId,
      userId
    });
  });
  
  // Handle message read status
  socket.on('message:read', ({ conversationId, messageIds }) => {
    io.to(`conversation:${conversationId}`).emit('messages:read', {
      conversationId,
      messageIds,
      readBy: userId
    });
    console.log(`👀 ${userName} read ${messageIds.length} messages in ${conversationId}`);
  });
  
  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${userName} (Socket ID: ${socket.id})`);
    
    // Remove from connected users
    connectedUsers.delete(userId);
    
    // Broadcast user offline status
    io.emit('user:offline', { userId, online: false });
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${userName}:`, error);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Scholar API Server Started!');
  console.log('='.repeat(60));
  console.log(`📡 HTTP Server: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket: ws://localhost:${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'Scholar'}`);
  console.log('='.repeat(60));
  console.log('✅ Ready to accept requests!');
  console.log('📬 Socket.IO ready for real-time chat');
  console.log('='.repeat(60) + '\n');
});

export default app;
export { io };

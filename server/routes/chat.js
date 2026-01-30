// ============================================================================
// CHAT ROUTES - Real-time messaging system
// Handles conversations, messages, and chat history
// ============================================================================

import express from 'express';
import { query } from '../../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all chat routes
router.use(authenticateToken);

// ============================================================================
// GET CONVERSATIONS - Get all conversations for current user
// ============================================================================
router.get('/conversations', async (req, res) => {
  const userId = req.user.userId;
  
  try {
    console.log(`📋 Fetching conversations for user: ${userId}`);
    
    // Get conversations with participant details and last message
    const result = await query(`
      SELECT 
        c.id,
        c.updated_at,
        c.created_at,
        u.id as participant_id,
        u.name as participant_name,
        u.email as participant_email,
        u.profile_image as participant_image,
        u.university as participant_university,
        u.field_of_study as participant_field,
        u.is_online as participant_online,
        u.last_seen as participant_last_seen,
        (
          SELECT COUNT(*)
          FROM messages m
          WHERE m.conversation_id = c.id
            AND m.receiver_id = $1
            AND m.is_read = false
        ) as unread_count,
        (
          SELECT json_build_object(
            'id', m.id,
            'content', m.content,
            'senderId', m.sender_id,
            'receiverId', m.receiver_id,
            'isRead', m.is_read,
            'createdAt', m.created_at
          )
          FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) as last_message
      FROM conversations c
      JOIN users u ON (
        CASE 
          WHEN c.user1_id = $1 THEN c.user2_id = u.id
          WHEN c.user2_id = $1 THEN c.user1_id = u.id
        END
      )
      WHERE c.user1_id = $1 OR c.user2_id = $1
      ORDER BY c.updated_at DESC
    `, [userId]);
    
    const conversations = result.rows.map(row => ({
      id: row.id,
      participant: {
        id: row.participant_id,
        name: row.participant_name,
        email: row.participant_email,
        profileImage: row.participant_image,
        university: row.participant_university,
        fieldOfStudy: row.participant_field,
        isOnline: row.participant_online,
        lastSeen: row.participant_last_seen
      },
      lastMessage: row.last_message,
      unreadCount: parseInt(row.unread_count),
      updatedAt: row.updated_at,
      createdAt: row.created_at
    }));
    
    console.log(`✅ Found ${conversations.length} conversations`);
    res.json(conversations);
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// ============================================================================
// GET OR CREATE CONVERSATION - Get existing or create new conversation
// ============================================================================
router.post('/conversations', async (req, res) => {
  const userId = req.user.userId;
  const { participantId } = req.body;
  
  if (!participantId) {
    return res.status(400).json({ error: 'Participant ID required' });
  }
  
  if (userId === participantId) {
    return res.status(400).json({ error: 'Cannot create conversation with yourself' });
  }
  
  try {
    console.log(`🔍 Finding/creating conversation between ${userId} and ${participantId}`);
    
    // Check if conversation already exists
    const existingConv = await query(`
      SELECT id FROM conversations
      WHERE (user1_id = $1 AND user2_id = $2)
         OR (user1_id = $2 AND user2_id = $1)
    `, [userId, participantId]);
    
    let conversationId;
    
    if (existingConv.rows.length > 0) {
      conversationId = existingConv.rows[0].id;
      console.log(`✅ Found existing conversation: ${conversationId}`);
    } else {
      // Create new conversation (ensure user1_id < user2_id for consistency)
      const [user1, user2] = [userId, participantId].sort();
      
      const newConv = await query(`
        INSERT INTO conversations (user1_id, user2_id)
        VALUES ($1, $2)
        RETURNING id
      `, [user1, user2]);
      
      conversationId = newConv.rows[0].id;
      console.log(`✅ Created new conversation: ${conversationId}`);
    }
    
    // Get conversation details with participant info
    const result = await query(`
      SELECT 
        c.id,
        c.updated_at,
        c.created_at,
        u.id as participant_id,
        u.name as participant_name,
        u.email as participant_email,
        u.profile_image as participant_image,
        u.university as participant_university,
        u.field_of_study as participant_field,
        u.is_online as participant_online,
        u.last_seen as participant_last_seen
      FROM conversations c
      JOIN users u ON (
        CASE 
          WHEN c.user1_id = $1 THEN c.user2_id = u.id
          WHEN c.user2_id = $1 THEN c.user1_id = u.id
        END
      )
      WHERE c.id = $2
    `, [userId, conversationId]);
    
    const row = result.rows[0];
    const conversation = {
      id: row.id,
      participant: {
        id: row.participant_id,
        name: row.participant_name,
        email: row.participant_email,
        profileImage: row.participant_image,
        university: row.participant_university,
        fieldOfStudy: row.participant_field,
        isOnline: row.participant_online,
        lastSeen: row.participant_last_seen
      },
      unreadCount: 0,
      updatedAt: row.updated_at,
      createdAt: row.created_at
    };
    
    res.json(conversation);
  } catch (error) {
    console.error('❌ Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// ============================================================================
// GET MESSAGES - Get all messages in a conversation
// ============================================================================
router.get('/conversations/:conversationId/messages', async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;
  const { limit = 50, before } = req.query;
  
  try {
    console.log(`📨 Fetching messages for conversation: ${conversationId}`);
    
    // Verify user is part of the conversation
    const convCheck = await query(`
      SELECT id FROM conversations
      WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)
    `, [conversationId, userId]);
    
    if (convCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }
    
    // Get messages
    let queryText = `
      SELECT 
        m.id,
        m.sender_id,
        m.receiver_id,
        m.content,
        m.is_read,
        m.message_type,
        m.created_at
      FROM messages m
      WHERE m.conversation_id = $1
    `;
    
    const params = [conversationId];
    
    if (before) {
      queryText += ` AND m.created_at < $2`;
      params.push(before);
    }
    
    queryText += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    
    const result = await query(queryText, params);
    
    const messages = result.rows.map(row => ({
      id: row.id,
      senderId: row.sender_id,
      receiverId: row.receiver_id,
      content: row.content,
      read: row.is_read,
      messageType: row.message_type,
      createdAt: row.created_at
    })).reverse(); // Reverse to get chronological order
    
    console.log(`✅ Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ============================================================================
// SEND MESSAGE - Send a new message
// ============================================================================
router.post('/conversations/:conversationId/messages', async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;
  const { receiverId, content, messageType = 'text' } = req.body;
  
  if (!content || !receiverId) {
    return res.status(400).json({ error: 'Content and receiver ID required' });
  }
  
  try {
    console.log(`💬 Sending message in conversation ${conversationId}`);
    
    // Verify user is part of the conversation
    const convCheck = await query(`
      SELECT id FROM conversations
      WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)
    `, [conversationId, userId]);
    
    if (convCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }
    
    // Insert message
    const result = await query(`
      INSERT INTO messages (conversation_id, sender_id, receiver_id, content, message_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, sender_id, receiver_id, content, is_read, message_type, created_at
    `, [conversationId, userId, receiverId, content, messageType]);
    
    // Update conversation timestamp
    await query(`
      UPDATE conversations
      SET updated_at = NOW()
      WHERE id = $1
    `, [conversationId]);
    
    const message = {
      id: result.rows[0].id,
      senderId: result.rows[0].sender_id,
      receiverId: result.rows[0].receiver_id,
      content: result.rows[0].content,
      read: result.rows[0].is_read,
      messageType: result.rows[0].message_type,
      createdAt: result.rows[0].created_at
    };
    
    console.log(`✅ Message sent: ${message.id}`);
    
    // Emit socket event if io is available
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${conversationId}`).emit('message:new', {
        ...message,
        conversationId
      });
    }
    
    res.status(201).json(message);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ============================================================================
// MARK MESSAGES AS READ
// ============================================================================
router.put('/conversations/:conversationId/read', async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;
  
  try {
    console.log(`👀 Marking messages as read in conversation: ${conversationId}`);
    
    const result = await query(`
      UPDATE messages
      SET is_read = true
      WHERE conversation_id = $1
        AND receiver_id = $2
        AND is_read = false
      RETURNING id
    `, [conversationId, userId]);
    
    const messageIds = result.rows.map(row => row.id);
    
    console.log(`✅ Marked ${messageIds.length} messages as read`);
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${conversationId}`).emit('messages:read', {
        conversationId,
        messageIds,
        readBy: userId
      });
    }
    
    res.json({ messageIds, count: messageIds.length });
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// ============================================================================
// DELETE CONVERSATION
// ============================================================================
router.delete('/conversations/:conversationId', async (req, res) => {
  const userId = req.user.userId;
  const { conversationId } = req.params;
  
  try {
    console.log(`🗑️ Deleting conversation: ${conversationId}`);
    
    // Verify user is part of the conversation
    const convCheck = await query(`
      SELECT id FROM conversations
      WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)
    `, [conversationId, userId]);
    
    if (convCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
    }
    
    // Delete conversation (messages will cascade delete)
    await query(`
      DELETE FROM conversations WHERE id = $1
    `, [conversationId]);
    
    console.log(`✅ Conversation deleted: ${conversationId}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export default router;

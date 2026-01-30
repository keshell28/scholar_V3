// ============================================================================
// DISCOVERY ROUTES - Student matching and discovery
// Handles user discovery, swipes, and connections
// ============================================================================

import express from 'express';
import { query } from '../../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all discovery routes
router.use(authenticateToken);

// ============================================================================
// GET DISCOVERY FEED - Get users to discover with smart matching algorithm
// ============================================================================
router.get('/feed', async (req, res) => {
  const userId = req.user.userId;
  const { 
    country, 
    connectionType, 
    fieldOfStudy,
    limit = 20 
  } = req.query;
  
  try {
    console.log(`🔍 Getting discovery feed for user: ${userId}`);
    
    // Get current user's profile for matching
    const currentUserResult = await query(`
      SELECT university, field_of_study, country, city, interests, connection_type
      FROM users
      WHERE id = $1
    `, [userId]);
    
    if (currentUserResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const currentUser = currentUserResult.rows[0];
    
    // Build WHERE clause based on filters
    let whereConditions = [`u.id != $1`]; // Exclude current user
    let queryParams = [userId];
    let paramIndex = 2;
    
    if (country && country !== 'all') {
      whereConditions.push(`u.country = $${paramIndex}`);
      queryParams.push(country);
      paramIndex++;
    }
    
    if (connectionType && connectionType !== 'all') {
      whereConditions.push(`u.connection_type = $${paramIndex}`);
      queryParams.push(connectionType);
      paramIndex++;
    }
    
    if (fieldOfStudy && fieldOfStudy !== 'all') {
      whereConditions.push(`u.field_of_study = $${paramIndex}`);
      queryParams.push(fieldOfStudy);
      paramIndex++;
    }
    
    // Get users that haven't been swiped on yet with relevance scoring
    const result = await query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.profile_image,
        u.university,
        u.field_of_study,
        u.country,
        u.city,
        u.bio,
        u.connection_type,
        u.interests,
        u.years_of_study,
        u.is_online,
        u.last_seen,
        -- Calculate match score (0-100)
        (
          -- Same university: 40 points
          CASE WHEN u.university = $${paramIndex} THEN 40 ELSE 0 END +
          -- Same field of study: 30 points
          CASE WHEN u.field_of_study = $${paramIndex + 1} THEN 30 ELSE 0 END +
          -- Same country: 15 points
          CASE WHEN u.country = $${paramIndex + 2} THEN 15 ELSE 0 END +
          -- Same city: 10 points (bonus if same country)
          CASE WHEN u.city = $${paramIndex + 3} AND u.country = $${paramIndex + 2} THEN 10 ELSE 0 END +
          -- Compatible connection type: 5 points
          CASE WHEN u.connection_type = $${paramIndex + 4} THEN 5 ELSE 0 END
        ) as match_score
      FROM users u
      WHERE ${whereConditions.join(' AND ')}
        -- Exclude users already swiped on
        AND NOT EXISTS (
          SELECT 1 
          FROM connections 
          WHERE user_id = $1 AND target_user_id = u.id
        )
      ORDER BY 
        match_score DESC,  -- Prioritize high match scores
        u.is_online DESC,  -- Then online users
        RANDOM()           -- Then randomize within same score
      LIMIT $${paramIndex + 5}
    `, [
      ...queryParams, 
      currentUser.university,
      currentUser.field_of_study,
      currentUser.country,
      currentUser.city,
      currentUser.connection_type,
      parseInt(limit)
    ]);
    
    const users = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      profileImage: row.profile_image,
      university: row.university,
      fieldOfStudy: row.field_of_study,
      country: row.country,
      city: row.city,
      bio: row.bio,
      connectionType: row.connection_type,
      interests: row.interests || [],
      yearsOfStudy: row.years_of_study,
      isOnline: row.is_online,
      lastSeen: row.last_seen,
      matchScore: row.match_score // Include match score in response
    }));
    
    console.log(`✅ Found ${users.length} users for discovery (sorted by relevance)`);
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching discovery feed:', error);
    res.status(500).json({ error: 'Failed to fetch discovery feed' });
  }
});

// ============================================================================
// POST SWIPE - Swipe right (like) or left (pass) on a user
// ============================================================================
router.post('/swipe', async (req, res) => {
  const userId = req.user.userId;
  const { targetUserId, action } = req.body; // action: 'like' or 'pass'
  
  if (!targetUserId || !action) {
    return res.status(400).json({ error: 'Target user ID and action required' });
  }
  
  if (!['like', 'pass'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action. Must be "like" or "pass"' });
  }
  
  if (userId === targetUserId) {
    return res.status(400).json({ error: 'Cannot swipe on yourself' });
  }
  
  try {
    console.log(`👉 ${userId} swiped ${action} on ${targetUserId}`);
    
    const status = action === 'like' ? 'pending' : 'passed';
    
    // Create connection record
    const result = await query(`
      INSERT INTO connections (user_id, target_user_id, status)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, target_user_id) 
      DO UPDATE SET status = $3, updated_at = NOW()
      RETURNING id, status
    `, [userId, targetUserId, status]);
    
    // If it's a like, check if there's a mutual match
    let isMatch = false;
    let conversation = null;
    
    if (action === 'like') {
      const mutualCheck = await query(`
        SELECT id, status 
        FROM connections
        WHERE user_id = $1 AND target_user_id = $2 AND status = 'pending'
      `, [targetUserId, userId]);
      
      if (mutualCheck.rows.length > 0) {
        // It's a match! Update both connections
        await query(`
          UPDATE connections
          SET status = 'matched', updated_at = NOW()
          WHERE (user_id = $1 AND target_user_id = $2)
             OR (user_id = $2 AND target_user_id = $1)
        `, [userId, targetUserId]);
        
        isMatch = true;
        
        console.log(`🎉 MATCH! ${userId} and ${targetUserId} matched!`);
        
        // Create a conversation for the match
        const [user1, user2] = [userId, targetUserId].sort();
        
        // Check if conversation already exists
        const existingConv = await query(`
          SELECT id FROM conversations
          WHERE (user1_id = $1 AND user2_id = $2)
             OR (user1_id = $2 AND user2_id = $1)
        `, [user1, user2]);
        
        if (existingConv.rows.length === 0) {
          const newConv = await query(`
            INSERT INTO conversations (user1_id, user2_id)
            VALUES ($1, $2)
            RETURNING id
          `, [user1, user2]);
          
          conversation = { id: newConv.rows[0].id };
        } else {
          conversation = { id: existingConv.rows[0].id };
        }
        
        // Get target user info for the response
        const targetUser = await query(`
          SELECT id, name, profile_image, university
          FROM users
          WHERE id = $1
        `, [targetUserId]);
        
        conversation.participant = {
          id: targetUser.rows[0].id,
          name: targetUser.rows[0].name,
          profileImage: targetUser.rows[0].profile_image,
          university: targetUser.rows[0].university
        };
      }
    }
    
    res.json({
      success: true,
      action,
      isMatch,
      conversation,
      connectionId: result.rows[0].id
    });
  } catch (error) {
    console.error('❌ Error processing swipe:', error);
    res.status(500).json({ error: 'Failed to process swipe' });
  }
});

// ============================================================================
// GET MATCHES - Get all matched connections
// ============================================================================
router.get('/matches', async (req, res) => {
  const userId = req.user.userId;
  
  try {
    console.log(`💚 Getting matches for user: ${userId}`);
    
    const result = await query(`
      SELECT 
        c.id as connection_id,
        c.created_at as matched_at,
        u.id,
        u.name,
        u.email,
        u.profile_image,
        u.university,
        u.field_of_study,
        u.country,
        u.city,
        u.bio,
        u.connection_type,
        u.interests,
        u.is_online,
        u.last_seen
      FROM connections c
      JOIN users u ON u.id = c.target_user_id
      WHERE c.user_id = $1 AND c.status = 'matched'
      ORDER BY c.updated_at DESC
    `, [userId]);
    
    const matches = result.rows.map(row => ({
      connectionId: row.connection_id,
      matchedAt: row.matched_at,
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
        profileImage: row.profile_image,
        university: row.university,
        fieldOfStudy: row.field_of_study,
        country: row.country,
        city: row.city,
        bio: row.bio,
        connectionType: row.connection_type,
        interests: row.interests || [],
        isOnline: row.is_online,
        lastSeen: row.last_seen
      }
    }));
    
    console.log(`✅ Found ${matches.length} matches`);
    res.json(matches);
  } catch (error) {
    console.error('❌ Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// ============================================================================
// GET CONNECTION STATUS - Check connection status with a user
// ============================================================================
router.get('/status/:targetUserId', async (req, res) => {
  const userId = req.user.userId;
  const { targetUserId } = req.params;
  
  try {
    const result = await query(`
      SELECT status, created_at
      FROM connections
      WHERE user_id = $1 AND target_user_id = $2
    `, [userId, targetUserId]);
    
    if (result.rows.length === 0) {
      return res.json({ status: 'none' });
    }
    
    res.json({
      status: result.rows[0].status,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    console.error('❌ Error checking connection status:', error);
    res.status(500).json({ error: 'Failed to check connection status' });
  }
});

// ============================================================================
// DELETE CONNECTION - Unmatch/block a user
// ============================================================================
router.delete('/connections/:connectionId', async (req, res) => {
  const userId = req.user.userId;
  const { connectionId } = req.params;
  
  try {
    console.log(`🗑️ Deleting connection: ${connectionId}`);
    
    // Verify the connection belongs to the user
    const result = await query(`
      DELETE FROM connections
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `, [connectionId, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    
    console.log(`✅ Connection deleted: ${connectionId}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting connection:', error);
    res.status(500).json({ error: 'Failed to delete connection' });
  }
});

export default router;

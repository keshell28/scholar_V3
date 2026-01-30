// ============================================================================
// STUDY GROUPS ROUTES - Group chat and study sessions
// Handles study group creation, membership, and group messaging
// ============================================================================

import express from 'express';
import { query } from '../../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all study group routes
router.use(authenticateToken);

// ============================================================================
// GET ALL STUDY GROUPS - Browse available study groups
// ============================================================================
router.get('/', async (req, res) => {
  const userId = req.user.userId;
  const { subject, isOnline } = req.query;
  
  try {
    console.log('📚 Fetching study groups...');
    
    let whereConditions = [];
    let queryParams = [userId];
    let paramIndex = 2;
    
    if (subject && subject !== 'all') {
      whereConditions.push(`sg.subject = $${paramIndex}`);
      queryParams.push(subject);
      paramIndex++;
    }
    
    if (isOnline !== undefined) {
      whereConditions.push(`sg.is_online = $${paramIndex}`);
      queryParams.push(isOnline === 'true');
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';
    
    const result = await query(`
      SELECT 
        sg.id,
        sg.name,
        sg.subject,
        sg.description,
        sg.creator_id,
        sg.max_members,
        sg.is_online,
        sg.schedule,
        sg.location,
        sg.tags,
        sg.next_session,
        sg.created_at,
        u.name as creator_name,
        u.profile_image as creator_image,
        COUNT(DISTINCT sgm.user_id) as member_count,
        BOOL_OR(sgm.user_id = $1) as is_member
      FROM study_groups sg
      LEFT JOIN study_group_members sgm ON sg.id = sgm.group_id
      LEFT JOIN users u ON sg.creator_id = u.id
      ${whereClause}
      GROUP BY sg.id, u.name, u.profile_image
      ORDER BY sg.created_at DESC
    `, queryParams);
    
    const groups = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      subject: row.subject,
      description: row.description,
      creatorId: row.creator_id,
      creatorName: row.creator_name,
      creatorImage: row.creator_image,
      maxMembers: row.max_members,
      memberCount: parseInt(row.member_count),
      isOnline: row.is_online,
      schedule: row.schedule,
      location: row.location,
      tags: row.tags || [],
      nextSession: row.next_session,
      createdAt: row.created_at,
      isMember: row.is_member
    }));
    
    console.log(`✅ Found ${groups.length} study groups`);
    res.json(groups);
  } catch (error) {
    console.error('❌ Error fetching study groups:', error);
    res.status(500).json({ error: 'Failed to fetch study groups' });
  }
});

// ============================================================================
// GET SINGLE STUDY GROUP - Get details including members
// ============================================================================
router.get('/:groupId', async (req, res) => {
  const userId = req.user.userId;
  const { groupId } = req.params;
  
  try {
    console.log(`📚 Fetching study group: ${groupId}`);
    
    // Get group details
    const groupResult = await query(`
      SELECT 
        sg.id,
        sg.name,
        sg.subject,
        sg.description,
        sg.creator_id,
        sg.max_members,
        sg.is_online,
        sg.schedule,
        sg.location,
        sg.tags,
        sg.next_session,
        sg.created_at,
        u.name as creator_name,
        u.profile_image as creator_image,
        EXISTS(SELECT 1 FROM study_group_members WHERE group_id = sg.id AND user_id = $1) as is_member
      FROM study_groups sg
      LEFT JOIN users u ON sg.creator_id = u.id
      WHERE sg.id = $2
    `, [userId, groupId]);
    
    if (groupResult.rows.length === 0) {
      return res.status(404).json({ error: 'Study group not found' });
    }
    
    // Get members
    const membersResult = await query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.profile_image,
        u.university,
        u.field_of_study,
        sgm.joined_at
      FROM study_group_members sgm
      JOIN users u ON sgm.user_id = u.id
      WHERE sgm.group_id = $1
      ORDER BY sgm.joined_at ASC
    `, [groupId]);
    
    const row = groupResult.rows[0];
    const group = {
      id: row.id,
      name: row.name,
      subject: row.subject,
      description: row.description,
      creatorId: row.creator_id,
      creatorName: row.creator_name,
      creatorImage: row.creator_image,
      maxMembers: row.max_members,
      isOnline: row.is_online,
      schedule: row.schedule,
      location: row.location,
      tags: row.tags || [],
      nextSession: row.next_session,
      createdAt: row.created_at,
      isMember: row.is_member,
      members: membersResult.rows.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        profileImage: m.profile_image,
        university: m.university,
        fieldOfStudy: m.field_of_study,
        joinedAt: m.joined_at
      }))
    };
    
    console.log(`✅ Found study group with ${group.members.length} members`);
    res.json(group);
  } catch (error) {
    console.error('❌ Error fetching study group:', error);
    res.status(500).json({ error: 'Failed to fetch study group' });
  }
});

// ============================================================================
// CREATE STUDY GROUP
// ============================================================================
router.post('/', async (req, res) => {
  const userId = req.user.userId;
  const { 
    name, 
    subject, 
    description, 
    maxMembers = 10,
    isOnline = true,
    schedule,
    location,
    tags = [],
    nextSession 
  } = req.body;
  
  if (!name || !subject) {
    return res.status(400).json({ error: 'Name and subject are required' });
  }
  
  try {
    console.log(`📚 Creating study group: ${name}`);
    
    // Create group
    const result = await query(`
      INSERT INTO study_groups (
        name, subject, description, creator_id, max_members,
        is_online, schedule, location, tags, next_session
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, created_at
    `, [
      name, subject, description, userId, maxMembers,
      isOnline, schedule, location, JSON.stringify(tags), nextSession
    ]);
    
    const groupId = result.rows[0].id;
    
    // Add creator as first member
    await query(`
      INSERT INTO study_group_members (group_id, user_id)
      VALUES ($1, $2)
    `, [groupId, userId]);
    
    console.log(`✅ Study group created: ${groupId}`);
    res.status(201).json({
      id: groupId,
      name,
      subject,
      description,
      creatorId: userId,
      maxMembers,
      memberCount: 1,
      isOnline,
      schedule,
      location,
      tags,
      nextSession,
      createdAt: result.rows[0].created_at,
      isMember: true
    });
  } catch (error) {
    console.error('❌ Error creating study group:', error);
    res.status(500).json({ error: 'Failed to create study group' });
  }
});

// ============================================================================
// JOIN STUDY GROUP
// ============================================================================
router.post('/:groupId/join', async (req, res) => {
  const userId = req.user.userId;
  const { groupId } = req.params;
  
  try {
    console.log(`👥 User ${userId} joining group ${groupId}`);
    
    // Check if group exists and has space
    const groupCheck = await query(`
      SELECT 
        sg.max_members,
        COUNT(sgm.user_id) as current_members
      FROM study_groups sg
      LEFT JOIN study_group_members sgm ON sg.id = sgm.group_id
      WHERE sg.id = $1
      GROUP BY sg.id, sg.max_members
    `, [groupId]);
    
    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Study group not found' });
    }
    
    const { max_members, current_members } = groupCheck.rows[0];
    
    if (parseInt(current_members) >= max_members) {
      return res.status(400).json({ error: 'Study group is full' });
    }
    
    // Check if already a member
    const memberCheck = await query(`
      SELECT id FROM study_group_members
      WHERE group_id = $1 AND user_id = $2
    `, [groupId, userId]);
    
    if (memberCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }
    
    // Add member
    await query(`
      INSERT INTO study_group_members (group_id, user_id)
      VALUES ($1, $2)
    `, [groupId, userId]);
    
    console.log(`✅ User joined study group`);
    res.json({ success: true, message: 'Joined study group successfully' });
  } catch (error) {
    console.error('❌ Error joining study group:', error);
    res.status(500).json({ error: 'Failed to join study group' });
  }
});

// ============================================================================
// LEAVE STUDY GROUP
// ============================================================================
router.post('/:groupId/leave', async (req, res) => {
  const userId = req.user.userId;
  const { groupId } = req.params;
  
  try {
    console.log(`👋 User ${userId} leaving group ${groupId}`);
    
    // Check if user is the creator
    const groupCheck = await query(`
      SELECT creator_id FROM study_groups WHERE id = $1
    `, [groupId]);
    
    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Study group not found' });
    }
    
    if (groupCheck.rows[0].creator_id === userId) {
      return res.status(400).json({ 
        error: 'Creator cannot leave the group. Delete the group instead.' 
      });
    }
    
    // Remove member
    const result = await query(`
      DELETE FROM study_group_members
      WHERE group_id = $1 AND user_id = $2
      RETURNING id
    `, [groupId, userId]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Not a member of this group' });
    }
    
    console.log(`✅ User left study group`);
    res.json({ success: true, message: 'Left study group successfully' });
  } catch (error) {
    console.error('❌ Error leaving study group:', error);
    res.status(500).json({ error: 'Failed to leave study group' });
  }
});

// ============================================================================
// DELETE STUDY GROUP (creator only)
// ============================================================================
router.delete('/:groupId', async (req, res) => {
  const userId = req.user.userId;
  const { groupId } = req.params;
  
  try {
    console.log(`🗑️ Deleting study group: ${groupId}`);
    
    // Verify user is the creator
    const result = await query(`
      DELETE FROM study_groups
      WHERE id = $1 AND creator_id = $2
      RETURNING id
    `, [groupId, userId]);
    
    if (result.rows.length === 0) {
      return res.status(403).json({ 
        error: 'Only the creator can delete this group' 
      });
    }
    
    console.log(`✅ Study group deleted`);
    res.json({ success: true, message: 'Study group deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting study group:', error);
    res.status(500).json({ error: 'Failed to delete study group' });
  }
});

// ============================================================================
// GET USER'S STUDY GROUPS
// ============================================================================
router.get('/user/my-groups', async (req, res) => {
  const userId = req.user.userId;
  
  try {
    console.log(`📚 Fetching user's study groups: ${userId}`);
    
    const result = await query(`
      SELECT 
        sg.id,
        sg.name,
        sg.subject,
        sg.description,
        sg.creator_id,
        sg.max_members,
        sg.is_online,
        sg.schedule,
        sg.location,
        sg.tags,
        sg.next_session,
        sg.created_at,
        COUNT(DISTINCT sgm.user_id) as member_count,
        (sg.creator_id = $1) as is_creator
      FROM study_groups sg
      JOIN study_group_members sgm ON sg.id = sgm.group_id
      WHERE sgm.user_id = $1
      GROUP BY sg.id
      ORDER BY sg.created_at DESC
    `, [userId]);
    
    const groups = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      subject: row.subject,
      description: row.description,
      creatorId: row.creator_id,
      maxMembers: row.max_members,
      memberCount: parseInt(row.member_count),
      isOnline: row.is_online,
      schedule: row.schedule,
      location: row.location,
      tags: row.tags || [],
      nextSession: row.next_session,
      createdAt: row.created_at,
      isCreator: row.is_creator,
      isMember: true
    }));
    
    console.log(`✅ Found ${groups.length} groups for user`);
    res.json(groups);
  } catch (error) {
    console.error('❌ Error fetching user groups:', error);
    res.status(500).json({ error: 'Failed to fetch user groups' });
  }
});

export default router;

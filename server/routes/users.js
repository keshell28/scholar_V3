// ============================================================================
// USER ROUTES
// Get user profile, update profile, etc.
// ============================================================================

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { query } from '../../database/connection.js';

const router = express.Router();

// GET /api/users/me - Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, name, university, field_of_study,
              country, city, bio, profile_image, interests, years_of_study,
              subscription_tier, connection_type, created_at
       FROM users 
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      university: user.university,
      fieldOfStudy: user.field_of_study,
      country: user.country,
      city: user.city,
      bio: user.bio || '',
      profileImage: user.profile_image,
      interests: user.interests || [],
      yearsOfStudy: user.years_of_study,
      connectionType: user.connection_type || 'friendship',
      subscriptionTier: user.subscription_tier
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

export default router;

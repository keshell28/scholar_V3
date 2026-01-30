// ============================================================================
// AUTHENTICATION ROUTES
// Registration, Login, Logout, Token Refresh
// ============================================================================

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../../database/connection.js';

const router = express.Router();

// Helper function to generate JWT tokens
function generateToken(userId, email) {
  return jwt.sign(
    { sub: userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
}

function generateRefreshToken(userId) {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register - Create new user account
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', { email: req.body.email, name: req.body.name });
    
    const { email, password, name, university, fieldOfStudy, country, city } = req.body;

    // Validation
    if (!email || !password || !name) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 8) {
      console.log('❌ Validation failed: Password too short');
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      console.log('❌ User already exists:', email);
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    console.log('💾 Creating user in database...');
    const result = await query(
      `INSERT INTO users (
        email, password_hash, name, university, field_of_study, 
        country, city, is_email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE)
      RETURNING id, email, name, university, field_of_study, 
                country, city, profile_image, bio, interests, 
                years_of_study, subscription_tier, created_at`,
      [email.toLowerCase(), passwordHash, name, university || '', fieldOfStudy || '', country || '', city || '']
    );

    const user = result.rows[0];
    console.log('✅ User created successfully:', user.id);

    // Generate tokens
    const token = generateToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    console.log('🎟️ Tokens generated');

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
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
        connectionType: 'friendship',
        subscriptionTier: user.subscription_tier
      },
      token
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    console.log('🔑 Login attempt:', { email: req.body.email });
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Validation failed: Missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    console.log('🔍 Looking up user...');
    const result = await query(
      `SELECT id, email, password_hash, name, university, field_of_study,
              country, city, bio, profile_image, interests, years_of_study,
              subscription_tier, connection_type
       FROM users 
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    console.log('✅ User found:', user.id);

    // Verify password
    console.log('🔐 Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ Password valid');

    // Update last seen
    await query('UPDATE users SET last_seen = NOW(), is_online = TRUE WHERE id = $1', [user.id]);

    // Generate tokens
    const token = generateToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    console.log('🎟️ Tokens generated, login successful');

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
      user: {
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
      },
      token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Update user online status
      await query('UPDATE users SET is_online = FALSE WHERE id = $1', [decoded.sub]);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    // Even if token is invalid, logout is successful
    res.clearCookie('refreshToken');
    res.json({ message: 'Logout successful' });
  }
});

// POST /api/auth/refresh - Refresh access token using HTTP-only cookie
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // Get user email
    const result = await query('SELECT email FROM users WHERE id = $1', [decoded.sub]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new access token
    const token = generateToken(decoded.sub, result.rows[0].email);

    res.json({ token });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

export default router;

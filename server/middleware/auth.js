// ============================================================================
// AUTHENTICATION MIDDLEWARE
// Verify JWT tokens on protected routes
// ============================================================================

import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('❌ Authentication failed: No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Set both id and userId for compatibility
    req.user = { 
      id: decoded.sub, 
      userId: decoded.sub, 
      email: decoded.email 
    };
    console.log('✅ Authenticated user:', decoded.sub);
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
}

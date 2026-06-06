const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication Middleware
 * Validates JWT tokens and protects private endpoints
 */
const protect = async (req, res, next) => {
  let token;

  // Read Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    logger.warn('Authentication attempted without token');
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Not authorized, token missing',
      code: 'UNAUTHORIZED'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user ID to request
    req.userId = decoded.id;
    next();
  } catch (error) {
    logger.warn(`Authentication failed for token: ${error.message}`);
    
    let message = 'Not authorized, invalid token';
    let code = 'INVALID_TOKEN';

    if (error.name === 'TokenExpiredError') {
      message = 'Session expired, please login again';
      code = 'TOKEN_EXPIRED';
    }

    return res.status(401).json({
      success: false,
      data: null,
      error: message,
      code
    });
  }
};

module.exports = { protect };

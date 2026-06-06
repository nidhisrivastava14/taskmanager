const { z } = require('zod');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const { mockDb } = require('../utils/mockDb');

// Define token sign helper
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Zod schema for registration validation
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Zod schema for login validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

/**
 * @desc Register user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    // Input validation with Zod
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map(issue => issue.message).join(', ');
      throw new AppError(errorMsg, 400, 'VALIDATION_ERROR');
    }

    const { name, email, password } = validationResult.data;
    const isDbConnected = mongoose.connection.readyState === 1;
    const db = isDbConnected ? User : mockDb.users;

    // Check if user already exists
    const existingUser = await db.findOne({ email });
    if (existingUser) {
      throw new AppError('Email address is already registered', 400, 'DUPLICATE_RESOURCE');
    }

    // Create user
    let user;
    if (isDbConnected) {
      user = await User.create({ name, email, password });
    } else {
      user = await mockDb.users.create({ name, email, password });
    }

    logger.info(`User registered successfully (${isDbConnected ? 'DB' : 'Offline Mock'}): ${user._id}`);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      code: 'REGISTER_SUCCESS'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Auth user & get token
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    // Input validation with Zod
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map(issue => issue.message).join(', ');
      throw new AppError(errorMsg, 400, 'VALIDATION_ERROR');
    }

    const { email, password } = validationResult.data;
    const isDbConnected = mongoose.connection.readyState === 1;
    const db = isDbConnected ? User : mockDb.users;

    // Check for user
    const user = await db.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Create token
    const token = signToken(user._id);

    logger.info(`User logged in successfully (${isDbConnected ? 'DB' : 'Offline Mock'}): ${user._id}`);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      code: 'LOGIN_SUCCESS'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};

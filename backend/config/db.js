const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB Atlas or Local MongoDB
 * Falls back to offline mock mode if both are unreachable
 */
const connectDB = async () => {
  // Option configurations to ensure short timeout on connection checks
  const atlasOptions = {
    serverSelectionTimeoutMS: 5000 // Timeout Atlas query quickly
  };

  const localOptions = {
    serverSelectionTimeoutMS: 3000 // Timeout local query quickly
  };

  // 1. Try MongoDB Atlas (Cloud)
  if (process.env.DB_URI) {
    try {
      logger.info('Attempting connection to MongoDB Atlas...');
      const conn = await mongoose.connect(process.env.DB_URI, atlasOptions);
      logger.info(`MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    } catch (atlasError) {
      logger.warn(`MongoDB Atlas connection failed: ${atlasError.message}`);
    }
  }

  // 2. Try Local MongoDB (Fallback)
  try {
    const localUri = 'mongodb://127.0.0.1:27017/taskapp';
    logger.info(`Attempting fallback connection to Local MongoDB at ${localUri}...`);
    const conn = await mongoose.connect(localUri, localOptions);
    logger.info(`Local MongoDB Connected: ${conn.connection.host}`);
  } catch (localError) {
    logger.error('MongoDB Atlas and Local Server are both unreachable.', localError);
    logger.warn('*** APPLICATION STARTING IN OFFLINE MOCK MODE (IN-MEMORY STORAGE) ***');
  }
};

module.exports = connectDB;

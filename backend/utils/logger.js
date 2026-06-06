/**
 * Logger Utility
 * Ensures proper, timestamped logs in development, and suppresses or formats
 * logs appropriately in production environments without raw console.logs.
 */

const isProduction = process.env.NODE_ENV === 'production';

const logger = {
  info: (message, ...args) => {
    if (!isProduction) {
      console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    if (!isProduction) {
      console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...args);
    }
  },
  error: (message, error) => {
    // In production, we print critical errors in a structured format for cloud logging (Render/AWS logs)
    const logPayload = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error ? (error.stack || error.message || error) : null
    };

    if (isProduction) {
      console.error(JSON.stringify(logPayload));
    } else {
      console.error(`[ERROR] [${logPayload.timestamp}] ${message}`, error || '');
    }
  }
};

module.exports = logger;

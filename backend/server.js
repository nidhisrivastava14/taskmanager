const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');
const logger = require('./utils/logger');

// Handle uncaught exceptions globally
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Server shutting down...', err);
  process.exit(1);
});

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || '*', // Accept requests from any client in dev, or specific origin in prod
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Request logger middleware (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Catch-all route for undefined paths
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404, 'ROUTE_NOT_FOUND'));
});

// Error handling middleware (MUST be loaded last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Server shutting down gracefully...', err);
  server.close(() => {
    process.exit(1);
  });
});

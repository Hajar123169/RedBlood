/**
 * Express application configuration
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./env');
const errorMiddleware = require('../middlewares/error');

// Initialize express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: env.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Development logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/v1/auth', require('../routes/authRoutes'));
app.use('/api/v1/users', require('../routes/userRoutes'));
app.use('/api/v1/donations', require('../routes/donationRoutes'));
app.use('/api/v1/requests', require('../routes/requestRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Handle undefined routes
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = { app };
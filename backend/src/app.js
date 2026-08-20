const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const storeOwnerRoutes = require('./routes/storeOwnerRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const { sendError } = require('./utils/response');

const app = express();

// Security and middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Store Rating Platform Backend API running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/stores/:storeId/ratings', ratingRoutes);
app.use('/api/store-owner', storeOwnerRoutes);

// 404 Handler
app.use((req, res, next) => {
  return sendError(res, 404, `Route ${req.originalUrl} not found`);
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;

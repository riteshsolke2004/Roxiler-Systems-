const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const storeOwnerRoutes = require('./routes/storeOwnerRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const { sendError, sendSuccess } = require('./utils/response');
const { seedDatabase } = require('../prisma/seed');

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

// Database Seeding Endpoint (Convenient for free-tier Render deployments)
app.get('/api/seed', async (req, res, next) => {
  try {
    const result = await seedDatabase();
    return sendSuccess(res, 200, 'Database seeded successfully with default Admin, Store Owners, Stores, and Ratings!', result);
  } catch (error) {
    return next(error);
  }
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

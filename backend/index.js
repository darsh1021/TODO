const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID'],
};
app.use(cors(corsOptions));

// Middleware to extract userId from X-User-ID header
app.use((req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) {
    req.userId = userId;
  }
  next();
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Routes
const annualPlanningRoutes = require('./routes/annualPlanning');
const monthlyTrackerRoutes = require('./routes/monthlyTracker');

// API Routes
app.use(`/api/${process.env.API_VERSION}/annual-planning`, annualPlanningRoutes);
app.use(`/api/${process.env.API_VERSION}/monthly-tracker`, monthlyTrackerRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Server Setup
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════╗
║  🚀 Server Started Successfully   ║
╠═══════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(21)} ║
║  Port: ${PORT.toString().padEnd(26)} ║
║  API Version: ${process.env.API_VERSION?.padEnd(20)} ║
╚═══════════════════════════════════╝
  `);
});

module.exports = app;

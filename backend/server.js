const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load env vars
dotenv.config();

// Import DB connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const recruiterRoutes = require('./routes/recruiter.routes');
const adminRoutes = require('./routes/admin.routes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Initialize express
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==================== MIDDLEWARE ====================

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

// HTTP request logger (dev mode)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Placement Portal API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount route handlers
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// ==================== SERVER ====================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log(`❤️  Health:   http://localhost:${PORT}/api/health`);
      console.log(`\nRoutes:`);
      console.log(`  Auth:      /api/auth`);
      console.log(`  Students:  /api/students`);
      console.log(`  Recruiters:/api/recruiters`);
      console.log(`  Admin:     /api/admin\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

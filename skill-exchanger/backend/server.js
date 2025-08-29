// Import required packages
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const config = require('./config');

// Import all route files
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const userRoutes = require('./routes/users.routes');
const requestRoutes = require('./routes/requests.routes');
const messageRoutes = require('./routes/messages.routes');
const ratingRoutes = require('./routes/ratings.routes');

// Import error handling middleware
const errorHandler = require('./middlewares/errorHandler');

// Create Express app
const app = express();

// Connect to MongoDB database
connectDB();

// Setup middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON data from requests

// Setup API routes
app.use('/api/auth', authRoutes); // Authentication routes (login, register)
app.use('/api/profile', profileRoutes); // Profile management routes
app.use('/api/users', userRoutes); // User search routes
app.use('/api/requests', requestRoutes); // Skill exchange request routes
app.use('/api/messages', messageRoutes); // Chat message routes
app.use('/api/ratings', ratingRoutes); // Rating and review routes

// Setup error handling (must be last)
app.use(errorHandler);

// Start the server
app.listen(config.APP_PORT, () => {
  console.log(`✅ Server is running on http://localhost:${config.APP_PORT}`);
});

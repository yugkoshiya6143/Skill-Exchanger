// Import mongoose for database connection
const mongoose = require('mongoose');
const config = require('./config');

// Function to connect to MongoDB database
const connectDB = async () => {
  try {
    // Try to connect to MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ MongoDB database connected successfully');
  } catch (error) {
    // If connection fails, show error and stop the app
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1); // Exit the application
  }
};

// Export the function so other files can use it
module.exports = connectDB;

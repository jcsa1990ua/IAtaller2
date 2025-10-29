/**
 * Database Configuration
 * 
 * This module handles MongoDB Atlas connection and configuration
 */

const mongoose = require('mongoose');

// MongoDB Connection String
// In production, this should be stored in environment variables
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://julioce1290_db_user:2Muu6iVMgWgDo0pJ@cluster0.t92aben.mongodb.net/data-privacy-vault?retryWrites=true&w=majority&appName=Cluster0';

// OpenAI API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Connect to MongoDB Atlas
 * 
 * @returns {Promise} MongoDB connection promise
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Use new URL parser
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
}

/**
 * Disconnect from MongoDB
 */
async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
  }
}

/**
 * Handle MongoDB connection events
 */
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB Atlas');
});

// Handle application termination
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  disconnectDB,
  MONGODB_URI,
  OPENAI_API_KEY
};


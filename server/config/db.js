const mongoose = require('mongoose');

const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/itnexus';
  
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    socketTimeoutMS: 45000,        // Close sockets after 45 seconds of inactivity
  };

  const connectWithRetry = async () => {
    console.log('Attempting MongoDB connection...');
    try {
      await mongoose.disconnect();
    } catch (e) {}

    mongoose.connect(dbUri, options)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      })
      .catch((err) => {
        console.error(`Database Connection Error: ${err.message}`);

        console.log('Retrying MongoDB connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
      });
  };

  // Prevent connection errors from causing unhandled exceptions and crashing the process
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected! Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully!');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error caught: ${err}`);
  });

  connectWithRetry();
};

module.exports = connectDB;

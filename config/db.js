// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const username = encodeURIComponent(`${process.env.db_username}`);
const password = encodeURIComponent(`${process.env.db_password}`);

const connectDB = async () => {
  try {

    // Connect to MongoDB using the URI from .env file and add dbName option
    await mongoose.connect(`mongodb+srv://${username}:${password}@clusterm0.o3gy7.mongodb.net/?retryWrites=true&w=majority&appName=ClusterM0`, {
      dbName: 'react-junit-app', // Add the name of your database here
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

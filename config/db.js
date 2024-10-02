// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  define: {
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
  },
});

// Function to authenticate and connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

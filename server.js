const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db'); // Import sequelize instance
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const costRoutes = require('./routes/costRoutes');
const path = require('path');

dotenv.config();
connectDB(); // Establish the connection to the database

const app = express();
app.use(express.json());
app.use(cors());

// Test the Sequelize connection before mounting routes
sequelize.authenticate().then(() => {
  console.log('Database connection established successfully');

  // Sync all models with the database
  sequelize.sync({ force: false }) // Set `force: true` to drop and recreate tables
    .then(() => {
      console.log('Tables synchronized successfully');
      
      // Mount the routes
      app.use('/api/auth', authRoutes);
      app.use('/api/user', userRoutes);
      app.use('/api/costs', costRoutes);
      app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Error synchronizing tables:', error);
    });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});


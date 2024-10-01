// server.js or app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const costRoutes = require('./routes/costRoutes');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Mount the auth and user routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/costs', costRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

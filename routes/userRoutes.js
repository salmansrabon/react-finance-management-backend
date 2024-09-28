// routes/userRoutes.js
const express = require('express');
const { getAllUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get all users
router.get('/users', protect, getAllUsers);

// Route to get a user by ID (Make sure you have this path with /user/:id)
router.get('/:id', protect, getUserById);

module.exports = router;

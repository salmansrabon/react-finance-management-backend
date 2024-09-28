// routes/userRoutes.js
const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get all users
router.get('/users', protect, getAllUsers);

// Route to get a user by ID (Make sure you have this path with /user/:id)
router.get('/:id', protect, getUserById);

// Update a user by ID
router.put('/:id', protect, updateUser); // Use HTTP PUT for updating a user

// Delete a user by ID
router.delete('/:id', protect, deleteUser); // Use HTTP DELETE for deleting a user
module.exports = router;

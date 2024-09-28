// controllers/userController.js
const User = require('../models/user');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Check if req.params.id is being captured
    console.log('Searching for user with ID:', id); // Log the ID to ensure it's received

    // Find user by _id in MongoDB
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Send back the user data as response
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from URL parameters

    // Find the user by ID and update with new data
    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body, // Data to update (make sure you validate this before)
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser); // Return the updated user data
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from URL parameters

    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };

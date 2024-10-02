const User = require('../models/user'); // Sequelize model
const upload = require('../config/multer');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Sequelize's findAll to get all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Searching for user with ID:', id);

    // Sequelize's findByPk to find by primary key
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Update user data using Sequelize's update method
    const [updatedRowsCount] = await User.update(req.body, {
      where: { _id: id },
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the updated user after successful update
    const updatedUser = await User.findByPk(id);

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete user using Sequelize's destroy method
    const deletedRowsCount = await User.destroy({ where: { _id: id } });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Upload user image and update profileImage field
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file selected' });
    }

    const { id } = req.params;
    const filePath = `/uploads/${req.file.filename}`;

    // Update user's profileImage field with the new file path
    const updatedRowsCount = await User.update(
      { profileImage: filePath },
      { where: { _id: id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the updated user after the update operation
    const updatedUser = await User.findByPk(id);

    res.status(200).json({
      message: 'Image uploaded successfully',
      profileImageUrl: updatedUser.profileImage,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { getAllUsers, getUserById, updateUser, deleteUser, uploadImage };

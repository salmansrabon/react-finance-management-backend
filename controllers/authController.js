// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Admin credentials (for demonstration purpose only; consider using a secure storage)
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'admin123';

// Function to generate JWT token with user ID and role
const generateToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register new user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, address, gender, termsAccepted } = req.body;

  try {
    // Check if the user already exists using Sequelize syntax
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      gender,
      termsAccepted,
    });

    res.status(201).json({
      _id: user._id, // Use user._id to match MongoDB-like ID
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: 'user',
      token: generateToken(user._id, 'user'),
    });
  } catch (error) {
    console.error('Error:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};


// User/Admin login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Admin login case
      res.json({
        _id: 'admin_id',
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        token: generateToken('admin_id', 'admin'), // Generate token with 'admin' role
      });
    } else {
      // Regular user login case
      const user = await User.findOne({ where: { email } }); // Use Sequelize's `where` clause

      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id, // Use Sequelize's `user._id`
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role), // Generate token with user's role
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { registerUser, loginUser };

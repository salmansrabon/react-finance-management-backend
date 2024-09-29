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
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

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
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: 'user', // Default role for registered users
      token: generateToken(user._id, 'user'), // Pass user role while generating token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User/Admin login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Admin login case
      res.json({
        _id: 'admin_id',
        email: ADMIN_EMAIL,
        role: 'admin',
        token: generateToken('admin_id', 'admin'), // Generate token with 'admin' role
      });
    } else {
      // Regular user login case
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role), // Generate token with user's role
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };

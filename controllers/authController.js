const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { google } = require('googleapis');
const { Sequelize } = require('sequelize');
const { sendEmail } = require('../sendMail'); // Import the sendMail function

// Admin credentials (for demonstration purpose only; consider using a secure storage)

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
    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address' });
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

    // Send a "Congratulations" email
    const subject = 'Congratulations on Registering!';
    const message = `
      Dear ${firstName},

      Welcome to our platform! We're excited to have you onboard.

      Best regards,
      Road to Career
    `;
    // await sendEmail(
    //   'noreply@roadtocareer.net', // Sender email address
    //   email, // Recipient email address (newly registered user)
    //   subject,
    //   message
    // );

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: 'user',
      token: generateToken(user._id, 'user'),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User/Admin login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email and password match the admin credentials in the .env file
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Admin login successful
      res.json({
        _id: 'admin_id',
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        token: generateToken('admin_id', 'admin'), // Generate a token with 'admin' role
      });
    } else {
      // Regular user login
      const user = await User.findOne({ where: { email } });

      if (user && (await user.matchPassword(password))) {
        // User login successful
        res.json({
          _id: user._id,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role), // Generate token for the user role
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


// Forgot password route
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is for the admin user
    if (email === process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Password reset not allowed for admin' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token and expiration time
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpire = Date.now() + 3600000; // Token valid for 1 hour

    // Update user with reset token and expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    // Send reset link to the user's email
    const resetUrl = `${process.env.APP_BASE_URL}/reset-password?token=${resetToken}`;

    // Use the sendEmail function to send the password reset email
    await sendEmail(
      'salman@roadtocareer.net', // The sender email
      user.email, // The receiver email
      'Password Reset Request',
      `Click on the following link to reset your password: ${resetUrl}`
    );

    res.status(200).json({ message: 'Password reset link sent to your email' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password route
const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  try {
    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpire: { [Sequelize.Op.gt]: Date.now() }, // Token not expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log(`Hashed Password: ${hashedPassword}`); // Log for debugging

    // Update the password (without triggering beforeSave hook)
    user.password = hashedPassword;

    // Clear the reset token fields
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    // Save user without triggering hooks
    await user.save({ hooks: false });

    console.log('Password reset successful for:', user.email);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { registerUser, loginUser, forgotPassword, resetPassword };


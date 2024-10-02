const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Decode the token to get user ID and role
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the role is admin, if so, no need to search in the database
      if (decoded.role === 'admin') {
        req.user = { id: decoded.id, role: 'admin' }; // Set the admin user in the request
      } else {
        // For regular users, find the user by ID from the token using Sequelize's findByPk
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ['password'] }, // Exclude password
        });

        // If no user found, return authorization error
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

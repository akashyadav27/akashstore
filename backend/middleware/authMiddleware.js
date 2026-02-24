const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

// Protect routes - must be logged in
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      next();
    } catch (error) {
      res.status(401).json({ message: '❌ Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: '❌ Not authorized, no token' });
  }
};

// Admin only routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: '❌ Not authorized as admin' });
  }
};

module.exports = { protect, adminOnly };
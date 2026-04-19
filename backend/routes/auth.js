const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  name: 'Tanush',
  password: 'Andhraax123'
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate input
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    // Check against hardcoded admin credentials
    if (name !== ADMIN_CREDENTIALS.name || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: 'admin',
        name: ADMIN_CREDENTIALS.name,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        name: ADMIN_CREDENTIALS.name,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      valid: true,
      admin: {
        name: decoded.name,
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;

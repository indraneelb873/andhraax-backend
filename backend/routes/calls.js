const express = require('express');
const router = express.Router();
const Call = require('../models/Call');
const auth = require('../middleware/auth');

// Get all calls
router.get('/', auth, async (req, res) => {
  try {
    const calls = await Call.find().sort({ createdAt: -1 });
    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single call
router.get('/:id', auth, async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);
    
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }
    res.json(call);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new call
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, email, date, time, message } = req.body;

    const call = new Call({
      name,
      phone,
      email,
      date,
      time,
      message
    });

    const savedCall = await call.save();
    res.status(201).json(savedCall);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update call status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const call = await Call.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete call
router.delete('/:id', auth, async (req, res) => {
  try {
    const call = await Call.findByIdAndDelete(req.params.id);
    
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    res.json({ message: 'Call deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

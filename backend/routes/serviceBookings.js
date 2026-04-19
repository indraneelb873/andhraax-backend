const express = require('express');
const router = express.Router();
const ServiceBooking = require('../models/ServiceBooking');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all service bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await ServiceBooking.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single service booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await ServiceBooking.findById(req.params.id)
      .populate('user', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new service booking
router.post('/', auth, async (req, res) => {
  try {
    const { user, serviceName, timeSlot, advancePayment } = req.body;

    // Generate booking number
    const bookingNumber = 'SB' + Date.now();

    const booking = new ServiceBooking({
      bookingNumber,
      user,
      serviceName,
      timeSlot,
      advancePayment
    });

    const savedBooking = await booking.save();
    
    // Create transaction for advance payment
    if (advancePayment && advancePayment.amount > 0) {
      const transaction = new Transaction({
        transactionId: 'TXN' + Date.now(),
        type: 'service_advance',
        amount: advancePayment.amount,
        description: `Advance payment for ${serviceName} - Booking ${bookingNumber}`,
        relatedServiceBooking: savedBooking._id,
        user: user,
        status: advancePayment.status || 'pending'
      });
      await transaction.save();
    }

    const populatedBooking = await ServiceBooking.findById(savedBooking._id)
      .populate('user', 'name email phone');
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept service booking
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const booking = await ServiceBooking.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    ).populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Decline service booking (with refund)
router.put('/:id/decline', auth, async (req, res) => {
  try {
    const booking = await ServiceBooking.findById(req.params.id).populate('user', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }

    // Update booking status
    booking.status = 'declined';
    await booking.save();

    // Process refund if advance payment was made
    if (booking.advancePayment.status === 'paid' && booking.advancePayment.amount > 0) {
      // Create refund transaction
      const refundTransaction = new Transaction({
        transactionId: 'REF' + Date.now(),
        type: 'refund',
        amount: booking.advancePayment.amount,
        description: `Refund for declined service booking ${booking.bookingNumber}`,
        relatedServiceBooking: booking._id,
        user: booking.user._id,
        status: 'completed'
      });
      await refundTransaction.save();

      // Update original transaction status
      await Transaction.findOneAndUpdate(
        { relatedServiceBooking: booking._id, type: 'service_advance' },
        { status: 'refunded' }
      );

      // Update advance payment status
      booking.advancePayment.status = 'refunded';
      await booking.save();
    }

    const updatedBooking = await ServiceBooking.findById(booking._id)
      .populate('user', 'name email phone');

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete service booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await ServiceBooking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }

    res.json({ message: 'Service booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

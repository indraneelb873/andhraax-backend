const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const ServiceBooking = require('../models/ServiceBooking');
const auth = require('../middleware/auth');

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email phone')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedServiceBooking', 'bookingNumber')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single transaction
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedServiceBooking', 'bookingNumber');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transactions by type
router.get('/type/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const transactions = await Transaction.find({ type })
      .populate('user', 'name email phone')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedServiceBooking', 'bookingNumber')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product order transactions (accessories)
router.get('/product-orders', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: 'product_order' })
      .populate('user', 'name email phone')
      .populate({
        path: 'relatedOrder',
        populate: {
          path: 'products.product',
          select: 'name price'
        }
      })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get service advance payment transactions
router.get('/service-advances', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: 'service_advance' })
      .populate('user', 'name email phone')
      .populate('relatedServiceBooking', 'bookingNumber serviceName')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create transaction (for testing purposes)
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, description, relatedOrder, relatedServiceBooking, user, paymentMethod } = req.body;

    const transaction = new Transaction({
      transactionId: 'TXN' + Date.now(),
      type,
      amount,
      description,
      relatedOrder,
      relatedServiceBooking,
      user,
      paymentMethod
    });

    const savedTransaction = await transaction.save();
    
    const populatedTransaction = await Transaction.findById(savedTransaction._id)
      .populate('user', 'name email phone')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedServiceBooking', 'bookingNumber');
    
    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process refund
router.post('/:id/refund', auth, async (req, res) => {
  try {
    const originalTransaction = await Transaction.findById(req.params.id);
    
    if (!originalTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (originalTransaction.status === 'refunded') {
      return res.status(400).json({ message: 'Transaction already refunded' });
    }

    // Create refund transaction
    const refundTransaction = new Transaction({
      transactionId: 'REF' + Date.now(),
      type: 'refund',
      amount: originalTransaction.amount,
      description: `Refund for ${originalTransaction.description}`,
      relatedOrder: originalTransaction.relatedOrder,
      relatedServiceBooking: originalTransaction.relatedServiceBooking,
      user: originalTransaction.user,
      status: 'completed'
    });

    await refundTransaction.save();

    // Update original transaction status
    originalTransaction.status = 'refunded';
    await originalTransaction.save();

    const populatedRefund = await Transaction.findById(refundTransaction._id)
      .populate('user', 'name email phone')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedServiceBooking', 'bookingNumber');

    res.json(populatedRefund);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

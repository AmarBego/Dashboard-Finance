const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifyToken');
const Transaction = require('../models/Transaction');
const { broadcast } = require('../websocket');
const logger = require('../logger');  // Assuming you have a centralized logger

// Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    logger.error('Error in GET /api/transactions:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { date, type, category, amount, isPaid, dueDate } = req.body;

    const newTransaction = new Transaction({
      userId: req.user.id,
      date,
      type,
      category,
      amount,
      isPaid: dueDate ? (isPaid || false) : null,
      dueDate,
    });

    const transaction = await newTransaction.save();
    
    // Broadcast the new transaction
    logger.info('About to broadcast new transaction');
    broadcast({ type: 'newTransaction', transaction });
    logger.info('Broadcast completed');
    
    res.json(transaction);
  } catch (err) {
    logger.error('Error in POST /api/transactions:', err);
    res.status(500).send('Server error');
  }
});

// Update a transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, type, category, amount, isPaid, dueDate } = req.body;

    let transactionFields = { 
      date, 
      type, 
      category, 
      amount, 
      dueDate,
      isPaid: dueDate ? (isPaid || false) : null
    };

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

    // Make sure user owns transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true }
    );

    // Broadcast the updated transaction
    logger.info('About to broadcast updated transaction');
    broadcast({ type: 'updateTransaction', transaction });
    logger.info('Broadcast completed');

    res.json(transaction);
  } catch (err) {
    logger.error('Error in PUT /api/transactions/:id:', err);
    res.status(500).send('Server Error');
  }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    // Broadcast the deleted transaction
    logger.info('About to broadcast deleted transaction');
    broadcast({ type: 'deleteTransaction', transactionId: req.params.id });
    logger.info('Broadcast completed');

    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    logger.error('Error in DELETE /api/transactions/:id:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
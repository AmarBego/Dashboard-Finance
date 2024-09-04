const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions); // This should be an array
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' }); // Send a JSON response for consistency
  }
});
// Add a new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { date, type, category, amount } = req.body;

    const newTransaction = new Transaction({
      userId: req.user.id,
      date,
      type,
      category,
      amount,
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, type, category, amount } = req.body;

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { date, type, category, amount },
      { new: true }
    );

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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

    await transaction.remove();
    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
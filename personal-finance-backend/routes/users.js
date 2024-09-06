const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifyToken');
const User = require('../models/User');

router.put('/theme', auth, async (req, res) => {
  try {
    const { selectedTheme } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { selectedTheme },
      { new: true }
    );
    res.json({ selectedTheme: user.selectedTheme });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const Transaction = require('../models/Transaction');

router.get('/:userId/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
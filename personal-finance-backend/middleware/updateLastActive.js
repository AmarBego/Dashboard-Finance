const User = require('../models/User');

const updateLastActive = async (req, res, next) => {
    if (req.user && req.user.id) {
      const now = new Date();
      now.setSeconds(0, 0);
      try {
        await User.findByIdAndUpdate(req.user.id, { lastActive: now });
      } catch (error) {
        console.error('Error updating lastActive:', error);
      }
    }
    next();
  };

module.exports = updateLastActive;
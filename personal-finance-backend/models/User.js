const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  selectedTheme: {
    type: String,
    default: 'light'
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [];

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ msg: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  res.status(201).json({ msg: 'User registered successfully' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
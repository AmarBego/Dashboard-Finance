const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const helmet = require('helmet');
const logger = require('./logger');
const updateLastActive = require('./middleware/updateLastActive');
const { initializeWebSocket } = require('./websocket');

const axios = require('axios');
const app = express();
const server = http.createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

app.use(helmet());

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_PORTFOLIO, process.env.API_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
  }
}

async function sendBroadcast(type, data) {
  try {
    await axios.post(`${process.env.API_URL}/api/broadcast`, { type, data });
  } catch (err) {
    logger.error('Error sending broadcast:', err);
  }
}
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./middleware/verifyToken'), updateLastActive, require('./routes/transactions'));
app.use('/api/users', require('./middleware/verifyToken'), updateLastActive, require('./routes/users'));

const PORT = process.env.PORT || 5001;
server.listen(PORT, async () => {
  await connectToDatabase();
  logger.info(`Server running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

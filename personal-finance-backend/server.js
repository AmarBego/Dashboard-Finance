const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const helmet = require('helmet');
const winston = require('winston');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');

const cron = require('node-cron');
const User = require('./models/User');

const app = express();

// Apply middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());
app.use(compression());
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '../personal-finance-dashboard/build')));

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'personal-finance-backend' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch((err) => logger.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../personal-finance-dashboard/build')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../personal-finance-dashboard/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Schedule task to run every minute
cron.schedule('* * * * *', async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const unconfirmedUsers = await User.find({
    isConfirmed: false,
    confirmationExpires: { $lt: fifteenMinutesAgo }
  });

  for (const user of unconfirmedUsers) {
    await User.findByIdAndDelete(user._id);
    logger.info(`Deleted unconfirmed user: ${user.email}`);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../personal-finance-dashboard/build', 'index.html'));
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const helmet = require('helmet');
const winston = require('winston');

const cron = require('node-cron');
const User = require('./models/User');

// Schedule task to run every minute
cron.schedule('* * * * *', async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
  const unconfirmedUsers = await User.find({
    isConfirmed: false,
    confirmationExpires: { $lt: fifteenMinutesAgo }
  });

  for (const user of unconfirmedUsers) {
    await User.findByIdAndDelete(user._id);
    console.log(`Deleted unconfirmed user: ${user.email}`);
  }
});

const app = express();

// Apply helmet middleware early
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});
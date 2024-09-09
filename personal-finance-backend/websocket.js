const WebSocket = require('ws');
const logger = require('./logger');
const axios = require('axios');

let wss;

function initializeWebSocket(server, db) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    logger.info('New WebSocket client connected');
    
    ws.on('message', async (message) => {
      logger.info('Received message:', message);
      try {
        const data = JSON.parse(message);
        if (data.type === 'newTransaction') {
          const newTransaction = await db.collection('transactions').insertOne(data.transaction);
          const transaction = await db.collection('transactions').findOne({ _id: newTransaction.insertedId });
          
          // Broadcast the new transaction to all clients
          await broadcastToAPI({ type: 'newTransaction', transaction });
          
          // Send confirmation back to the sender
          ws.send(JSON.stringify({ type: 'transactionConfirmation', transaction }));
        }
      } catch (error) {
        logger.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Error processing transaction' }));
      }
    });

    ws.on('close', () => {
      logger.info('WebSocket client disconnected');
    });
  });

  logger.info('WebSocket server initialized');
}

async function broadcastToAPI(data) {
  try {
    await axios.post(`${process.env.API_URL}/api/broadcast`, data, {
      headers: {
        'x-api-key': process.env.API_KEY
      }
    });
  } catch (error) {
    logger.error('Error sending broadcast to API server:', error);
  }
}

module.exports = { initializeWebSocket, broadcastToAPI };
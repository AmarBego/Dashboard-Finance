const WebSocket = require('ws');
const logger = require('./logger');

let wss;

function initializeWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    logger.info('New WebSocket client connected');
    
    ws.on('message', (message) => {
      logger.info('Received message:', message);
    });

    ws.on('close', () => {
      logger.info('WebSocket client disconnected');
    });
  });

  logger.info('WebSocket server initialized');
}

function broadcast(data) {
    logger.info('Entering broadcast function');
    logger.info(`Number of WebSocket clients: ${wss ? wss.clients.size : 0}`);
    if (wss) {
        wss.clients.forEach((client) => {
            logger.info('Client readyState:', client.readyState);
            if (client.readyState === WebSocket.OPEN) {
                try {
                    client.send(JSON.stringify(data));
                    logger.info('Data sent to client');
                } catch (error) {
                    logger.error('Error sending data to client:', error);
                }
            } else {
                logger.info('Client is not open for broadcasting');
            }
        });
    } else {
        logger.warn('WebSocket server not initialized');
    }
    logger.info('Exiting broadcast function');
}

module.exports = { initializeWebSocket, broadcast };
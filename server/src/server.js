require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./config/logger');

const startServer = async () => {
  await connectDB();

  const preferredPort = Number(process.env.PORT || 5000);

  const listenOnPort = (port) => new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
      resolve(server);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && port < preferredPort + 10) {
        logger.warn(`Port ${port} is busy. Retrying on ${port + 1}...`);
        resolve(listenOnPort(port + 1));
        return;
      }

      reject(err);
    });
  });

  const server = await listenOnPort(preferredPort);

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer();

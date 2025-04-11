const morgan = require('morgan');
const winston = require('winston');
const config = require('../config');

// Configure Winston logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-gateway' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

// Create a Morgan stream that writes to Winston
morgan.token('user-id', (req) => req.session?.user?._id || 'anonymous');

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms - :user-id',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

module.exports = morganMiddleware;
module.exports.logger = logger;

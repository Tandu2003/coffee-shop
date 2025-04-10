const { logger } = require('./logging');

// Central error handler middleware
module.exports = (err, req, res, next) => {
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    userId: req.session?.user?._id || 'anonymous'
  });

  // If headers have already been sent, delegate to Express' default error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle specific error types
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication is required to access this resource'
    });
  }

  if (err.name === 'ForbiddenError' || err.status === 403) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'You do not have permission to access this resource'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message
    });
  }

  if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'The requested service is currently unavailable'
    });
  }

  // Default to 500 server error
  return res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  });
};

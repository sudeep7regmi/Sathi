// Central error + 404 handlers
export function notFound(req, res, next) {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error('✗', err.message);
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.error || 'An error occurred';
  res.status(status).json({ code: status,error: message });
}
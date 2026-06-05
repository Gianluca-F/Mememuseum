import sanitizeHtml from 'sanitize-html';

export function sanitizeInput (req, res, next) {
  if (req.body) {
    for (const key in req.body) {
      if (
        typeof req.body[key] === 'string' &&
        !['password', 'newPassword', 'currentPassword'].includes(key)
      ) {
        req.body[key] = sanitizeHtml(req.body[key]);
      }
    }
  }
  next();
};
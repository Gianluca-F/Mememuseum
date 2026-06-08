import { AuthController } from '../controllers/AuthController.js';
import { isTokenValid } from '../utils/JwtUtils.js';

/**
 * Middleware to optionally authenticate the user if a token is provided
 * Useful for routes that can be accessed by both authenticated and unauthenticated users
 * If a valid token is provided, the user information will be attached to req.user
 * Used for retrieveing voteMemes
 */
export function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return next();
  }

  isTokenValid(token, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return next({ status: 401, message: 'Unauthorized' });
  }

  isTokenValid(token, (err, user) => {
    if (err) {
      return next({ status: 401, message: 'Unauthorized' });
    }
    req.user = user;
    next();
  });
}

export async function ensureUsersModifyOnlyTheirMemes(req, res, next) {
  const userId = req.user?.id;
  const memeId = req.params.memeId;

  if (!userId) {
    return next({ status: 401, message: 'Unauthorized' });
  }

  try {
    await AuthController.canUserModifyMeme(userId, memeId); // Throws an error if the user cannot modify the meme
    next();
  } catch (err) {
    next(err);
  }
}

export async function ensureUsersModifyOnlyTheirComments(req, res, next) {
  const userId = req.user?.id;
  const commentId = req.params.commentId;

  if (!userId) {
    return next({ status: 401, message: 'Unauthorized' });
  }

  try {
    await AuthController.canUserModifyComment(userId, commentId); // Throws an error if the user cannot modify the comment
    next();
  } catch (err) {
    next(err);
  }
}
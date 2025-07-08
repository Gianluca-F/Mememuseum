import { AuthController } from '../controllers/AuthController.js';
import { isTokenValid } from '../utils/JwtUtils.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw { status: 401, message: 'Unauthorized' };
  }

  isTokenValid(token, (err, user) => {
    if (err) {
      throw { status: 401, message: 'Unauthorized' };
    }
    req.user = user;
    next();
  });
}

export async function ensureUsersModifyOnlyTheirMemes(req, res, next) {
  const userId = req.user.id;
  const memeId = req.params.memeId;

  try {
    await AuthController.canUserModifyMeme(userId, memeId); // Throws an error if the user cannot modify the meme
    next();
  } catch (err) {
    next(err);
  }
}

export async function ensureUsersModifyOnlyTheirComments(req, res, next) {
  const userId = req.user.id;
  const commentId = req.params.commentId;

  try {
    await AuthController.canUserModifyComment(userId, commentId); // Throws an error if the user cannot modify the comment
    next();
  } catch (err) {
    next(err);
  }
}
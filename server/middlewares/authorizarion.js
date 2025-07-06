import { isTokenValid } from '../utils/JwtUtils.js';

const SECRET_KEY = process.env.TOKEN_SECRET || 'una_chiave_segreta_di_sviluppo';

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

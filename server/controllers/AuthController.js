import bcrypt from 'bcrypt';
import { User, Meme, Comment } from '../data/Database.js';

export class AuthController {

  static async checkCredentials({ userName, password}) {
    // Validate input
    if (!userName || !password) {
      throw { status: 400, message: 'Username and password are required' };
    }

    // Find user by username
    const user = await User.findOne({ where: { userName: userName } });

    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    // Compare provided password with hashed password in database
    const isValidPassword = await bcrypt.compare(pwd, user.password);

    if (!isValidPassword) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    return user;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async saveUser({ userName, password }) {
    // Validate input
    if (!userName || !password) {
      throw { status: 400, message: 'Username and password are required' };
    }

    try {
      // Attempt to create a new user
      return await User.create({
        userName: userName,
        password: password, // Hashing will be handled by the User model
      });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        throw { status: 409, message: 'Username already exists' };
      } else {
        throw { status: 500, message: 'Error creating user' };
      }
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async canUserModifyMeme(userId, memeId) {
    if (!userId || !memeId) {
      throw { status: 400, message: 'Missing user ID or meme ID' };
    }

    const meme = await Meme.findByPk(memeId, {
      attributes: ['UserId'],
      raw: true,
    });

    if (!meme) {
      throw { status: 404, message: 'Meme not found' };
    }

    if (meme.UserId !== userId) {
      throw { status: 403, message: 'Forbidden! You do not have permissions to modify this meme' };
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async canUserModifyComment(userId, commentId) {
    if (!userId || !commentId) {
      throw { status: 400, message: 'Missing user ID or comment ID' };
    }

    const comment = await Comment.findByPk(commentId, {
      attributes: ['UserId'],
      raw: true,
    });

    if (!comment) {
      throw { status: 404, message: 'Comment not found' };
    }

    if (comment.UserId !== userId) {
      throw { status: 403, message: 'Forbidden! You do not have permissions to modify this comment' };
    }
  }
}
import bcrypt from 'bcrypt';
import { User, Meme, Comment } from '../data/Database.js';

export class AuthController {

  static async checkCredentials({ userName, password}) {
    // Validate input
    if (!userName || !password) {
      throw { status: 400, error: 'Username and password are required' };
    }

    // Find user by username
    const user = await User.findOne({ where: { userName: userName } });

    if (!user) {
      throw { status: 401, error: 'Invalid credentials' };
    }

    // Compare provided password with hashed password in database
    const isValidPassword = await bcrypt.compare(pwd, user.password);

    if (!isValidPassword) {
      throw { status: 401, error: 'Invalid credentials' };
    }

    return user;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async saveUser({ userName, password }) {
    // Validate input
    if (!userName || !password) {
      throw { status: 400, error: 'Username and password are required' };
    }

    try {
      // Attempt to create a new user
      return await User.create({
        userName: userName,
        password: password, // Hashing will be handled by the User model
      });
    } catch (err) {
      // Handle errors, such as unique constraint violations
      console.error('Error creating user:', err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        throw { status: 409, error: 'Username already exists' };
      } else {
        throw { status: 500, error: 'Error creating user' };
      }
    }
  }

  static async canUserModifyMeme(userId, memeId) {
    // TODO: Implement logic to check if the user can modify the meme
  }

  static async canUserModifyComment(userId, commentId) {
    // TODO: Implement logic to check if the user can modify the comment
  }
}
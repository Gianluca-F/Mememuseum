import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { issueToken } from '../utils/JwtUtils.js';

export const authenticationRouter = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description:  Authenticate user
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: User credentials for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "st0ck"
 *               password:
 *                 type: string
 *                 example: "seCurep4ass"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid username or password"
 */
authenticationRouter.post('/login', async (req, res, next) => {
  try {  
    const user = await AuthController.checkCredentials(req.body);
    const token = issueToken(user.id, user.userName);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     description: Save a new user
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: User credentials for registration
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "st0ck"
 *               password:
 *                 type: string
 *                 example: "seCurep4ass"
 *     responses:
 *       201:
 *         description: User saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       400:
 *         description: Invalid user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username and password are required"
 *       409:
 *         description: Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username already exists"
 */
authenticationRouter.post('/signup', async (req, res, next) => {
  try {
    const user = await AuthController.saveUser(req.body);
    const token = issueToken(user.id, user.userName);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
});
import express from 'express';
import { MemeController } from '../controllers/MemeController.js';
import { authenticateToken } from '../middlewares/authorizarion.js';
import { uploader } from '../middlewares/uploader.js';

export const memeRouter = express.Router();

/**
 * @swagger
 * /memes:
 *   get:
 *     summary: Get all memes
 *     description: Retrieve a list of all memes with optional filters and pagination
 *     tags: [Memes]
 *     responses:
 *       200:
 *         description: List of memes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   title:
 *                     type: string
 *                     example: "When your code finally works"
 *                   description:
 *                     type: string
 *                     example: "That moment after hours of debugging..."
 *                   imageUrl:
 *                     type: string
 *                     example: "https://example.com/meme.jpg"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["programming", "debugging"]
 *                   upvotes:
 *                     type: integer
 *                     example: 123
 *                   downvotes:
 *                     type: integer
 *                     example: 7
 *                   commentsCount:
 *                     type: integer
 *                     example: 5
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-04T12:00:00Z"
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "098e2317-e89b-12d3-a456-426614134789"
 *                       userName:
 *                         type: string
 *                         example: "memeLord"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while retrieving memes"
 */
memeRouter.get('/', async (req, res, next) => {
  try {
    const memes = await MemeController.getAllMemes(req.query);
    res.json(memes);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /memes/meme-of-the-day:
 *   get:
 *     summary: Get the meme of the day
 *     description: Retrieve the meme of the day
 *     tags: [Memes]
 *     responses:
 *       200:
 *         description: Meme of the day found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 title:
 *                   type: string
 *                   example: "When your code finally works"
 *                 description:
 *                   type: string
 *                   example: "That moment after hours of debugging..."
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/meme.jpg"
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["programming", "debugging"]
 *                 upvotes:
 *                   type: integer
 *                   example: 123
 *                 downvotes:
 *                   type: integer
 *                   example: 7
 *                 commentsCount:
 *                   type: integer
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-04T12:00:00Z"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "098e2317-e89b-12d3-a456-426614134789"
 *                     userName:
 *                       type: string
 *                       example: "memeLord"
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "456e7890-e12b-34d5-a678-123456789012"
 *                       content:
 *                         type: string
 *                         example: "LOL this is so true"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-04T13:15:00Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "789e0123-e45b-67d8-a901-234567890123"
 *                           userName:
 *                             type: string
 *                             example: "funnyGuy42"
 *       404:
 *         description: Meme of the day not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Meme of the day not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while retrieving the meme of the day"
 */
memeRouter.get('/meme-of-the-day', async (req, res, next) => {
  try {
    const memeOfTheDayId = await MemeController.getMemeOfTheDay();
    const meme = await MemeController.getMemeById(memeOfTheDayId);
    if (!meme) {
      throw { status: 404, message: 'Meme of the day not found' };
    }
    res.json(meme);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /memes/{id}:
 *   get:
 *     summary: Get a single meme by ID
 *     description: Retrieve detailed information about a specific meme
 *     tags: [Memes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the meme
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Meme found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 title:
 *                   type: string
 *                   example: "When your code finally works"
 *                 description:
 *                   type: string
 *                   example: "That moment after hours of debugging..."
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/meme.jpg"
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["programming", "debugging"]
 *                 upvotes:
 *                   type: integer
 *                   example: 123
 *                 downvotes:
 *                   type: integer
 *                   example: 7
 *                 commentsCount:
 *                   type: integer
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-04T12:00:00Z"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "098e2317-e89b-12d3-a456-426614134789"
 *                     userName:
 *                       type: string
 *                       example: "memeLord"
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "456e7890-e12b-34d5-a678-123456789012"
 *                       content:
 *                         type: string
 *                         example: "LOL this is so true"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-04T13:15:00Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "789e0123-e45b-67d8-a901-234567890123"
 *                           userName:
 *                             type: string
 *                             example: "funnyGuy42"
 *       400:
 *         description: Invalid user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid meme ID
 *       404:
 *         description: Meme not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Meme not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while retrieving the meme"
 */
memeRouter.get('/:id', async (req, res, next) => {
  try {
    const meme = await MemeController.getMemeById(req.params.id);
    if (!meme) {
      throw { status: 404, message: 'Meme not found'}
    }
    res.json(meme);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /memes:
 *   post:
 *     summary: Create a new meme
 *     description: Upload a new meme with title, description, tags, and image
 *     tags: [Memes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "When your code finally works"
 *               description:
 *                 type: string
 *                 example: "That moment after hours of debugging..."
 *               tags:
 *                 type: string
 *                 description: "Comma separated tags"
 *                 example: "programming, debugging"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Meme created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 title:
 *                   type: string
 *                   example: "When your code finally works"
 *                 description:
 *                   type: string
 *                   example: "That moment after hours of debugging..."
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/meme.jpg"
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["programming", "debugging"]
 *                 upvotes:
 *                   type: integer
 *                   example: 123
 *                 downvotes:
 *                   type: integer
 *                   example: 7
 *                 commentsCount:
 *                   type: integer
 *                   example: 5
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-04T12:00:00Z"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "098e2317-e89b-12d3-a456-426614134789"
 *                     userName:
 *                       type: string
 *                       example: "memeLord"
 *       400:
 *         description: Invalid meme data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid meme data"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while creating the meme"
 */
memeRouter.post('/', authenticateToken, uploader.single('image'), async (req, res, next) => {
  try {
    const memeData = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      imageUrl: `/uploads/${req.file.filename}`
    };
    const newMeme = await MemeController.createMeme(memeData, req.user.id);
    res.status(201).json(newMeme);
  } catch (err) {
    next(err);
  }
});
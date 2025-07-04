import express from 'express';
import { MemeController } from '../controllers/memeController.js';
import { checkMemeAuthorization } from '../middleware/utils/authorization.js';
import { uploader } from '../data/local/multerStorage/uploader.js';

export const memeRouter = express.Router();

/**
 * @swagger
 * /memes:
 *   get:
 *     description: Get all memes
 *     produces:
 *       - application/json
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
 *                   type: UUID
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
 *                       type: UUID
 *                       example: "098e2317-e89b-12d3-a456-426614134789"
 *                     userName:
 *                       type: string
 *                       example: "memeLord"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred
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
 * /memes/{id}:
 *   get:
 *     description: Get a single meme by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the meme
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meme found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: UUID
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
 *                       type: UUID
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
 *                         type: UUID
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
 *                             type: UUID
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
 *                   example: Meme not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while retrieving the meme
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



memeRouter.get('/meme-of-the-day', async (req, res, next) => {
  try {
    const memeOfTheDay = await MemeController.getMemeOfTheDay();
    res.json(memeOfTheDay);
  } catch (err) {
    next(err);
  }
});

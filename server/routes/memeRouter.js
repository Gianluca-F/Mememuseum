import express from 'express';
import { MemeController } from '../controllers/MemeController.js';
import { authenticateToken, ensureUsersModifyOnlyTheirMemes } from '../middlewares/authorization.js';
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
 * /memes/{memeId}:
 *   get:
 *     summary: Get a single meme by ID
 *     description: Retrieve detailed information about a specific meme
 *     tags: [Memes]
 *     parameters:
 *       - in: path
 *         name: memeId
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
memeRouter.get('/:memeId', async (req, res, next) => {
  try {
    const meme = await MemeController.getMemeById(req.params.memeId);
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
 *     security:
 *       - bearerAuth: []
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
 *                 UserId:
 *                   type: string
 *                   format: uuid
 *                   example: "098e2317-e89b-12d3-a456-426614134789"
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

/**
 * @swagger
 * /memes/{memeId}:
 *   put:
 *     summary: Update an existing meme
 *     description: Update the title, description, tags, and image of a meme
 *     tags: [Memes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memeId
 *         required: true
 *         description: The ID of the meme to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Meme Title"
 *               description:
 *                 type: string
 *                 example: "Updated description for the meme"
 *               tags:
 *                 type: string
 *                 description: "Comma separated tags"
 *                 example: "funny, coding"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Meme updated successfully
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
 *                   example: "Updated Meme Title"
 *                 description:
 *                   type: string
 *                   example: "Updated description for the meme"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/updated-meme.jpg"
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["funny", "coding"]
 *                 upvotes:
 *                   type: integer
 *                   example: 150
 *                 downvotes:
 *                   type: integer
 *                   example: 5
 *                 commentsCount:
 *                   type: integer
 *                   example: 10
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-04T12:00:00Z"
 *                 UserId:
 *                  type: string
 *                  format: uuid
 *                  example: "098e2317-e89b-12d3-a456-426614134789"
 *       400:
 *         description: Missing user ID or meme ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing user ID or meme ID"
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden! You do not have permissions to view or modify this resource"
 *       404:
 *         description: Not Found
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
 *                   example: "An error occurred while updating the meme"
 */
memeRouter.put('/:memeId', authenticateToken, ensureUsersModifyOnlyTheirMemes, uploader.single('image'), async (req, res, next) => {
  try {
    const memeData = {};
    if (req.body.title) {
      memeData.title = req.body.title;
    }
    if (req.body.description) {
      memeData.description = req.body.description;
    }
    if (req.body.tags) {
      memeData.tags = req.body.tags;
    }
    if (req.file) { // Check if a new image file was uploaded
      memeData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const updatedMeme = await MemeController.updateMeme(req.params.memeId, memeData, req.user.id);
    res.json(updatedMeme);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /memes/{memeId}:
 *   delete:
 *     summary: Delete a meme
 *     description: Delete a meme by its ID. Only the meme owner can delete it.
 *     tags: [Memes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memeId
 *         required: true
 *         description: The ID of the meme to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Meme deleted successfully (no content)
 *       400:
 *         description: Meme ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Meme ID is required"
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
 *       403:
 *         description: Forbidden - user cannot delete this meme
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden! You do not have permissions to view or modify this resource"
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
 *                   example: "An unexpected error occurred while deleting the meme"
 */
memeRouter.delete('/:memeId', authenticateToken, ensureUsersModifyOnlyTheirMemes, async (req, res, next) => {
  try {
    await MemeController.deleteMeme(req.params.memeId);
    res.status(204).send(); // No content
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /memes/{memeId}/vote:
 *   post:
 *     summary: Vote or toggle vote on a meme
 *     description: Allows an authenticated user to upvote or downvote a meme. 
 *                  If the same vote is sent twice, it will remove the vote.
 *     tags:
 *       - Memes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memeId
 *         required: true
 *         description: The ID of the meme to vote on
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 example: upvote
 *     responses:
 *       200:
 *         description: Vote registered or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meme:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     title:
 *                       type: string
 *                       example: "When your code finally works"
 *                     description:
 *                       type: string
 *                       example: "That moment after hours of debugging..."
 *                     imageUrl:
 *                       type: string
 *                       example: "https://example.com/meme.jpg"
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["programming", "debugging"]
 *                     upvotes:
 *                       type: integer
 *                       example: 123
 *                     downvotes:
 *                       type: integer
 *                       example: 7
 *                     commentsCount:
 *                       type: integer
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-04T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-05T10:00:00Z"
 *                     UserId:
 *                      type: string
 *                      format: uuid
 *                      example: "098e2317-e89b-12d3-a456-426614134789"
 *                 message:
 *                   type: string
 *                   example: Vote recorded as upvote
 *       400:
 *         description: Invalid request or vote type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid vote type. Must be "upvote" or "downvote"
 *       401:
 *         description: Unauthorized, missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
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
 *         description: Server error while processing vote
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while processing the vote
 */
memeRouter.post('/:memeId/vote', authenticateToken, async (req, res, next) => {
  try {
    const { meme, message } = await MemeController.voteMeme(req.params.memeId, req.body.type, req.user.id);
    res.json({ meme, message });
  } catch (err) {
    next(err);
  }
});
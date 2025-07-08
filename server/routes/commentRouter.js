import express from 'express';
import { CommentController } from '../controllers/CommentController.js';
import { ensureUsersModifyOnlyTheirComments } from '../middlewares/authorization.js';

export const commentRouter = express.Router();

/**
 * @swagger
 * /memes/{memeId}/comments:
 *   post:
 *     summary: Create a new comment for a meme
 *     description: Add a comment to a specific meme
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the meme to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This meme is hilarious!"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "c123e4567-e89b-12d3-a456-426614174000"
 *                     content:
 *                       type: string
 *                       example: "This meme is hilarious!"
 *                     MemeId:
 *                       type: string
 *                       format: uuid
 *                     UserId:
 *                       type: string
 *                       format: uuid
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully"
 *       400:
 *         description: Invalid comment data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid comment data"
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
 *         description: User or meme not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User or meme not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred while creating the comment"
 */
commentRouter.post('/', async (req, res, next) => {
  const { content } = req.body;
  const { memeId } = req.params;

  try {
    const {comment, message} = await CommentController.createComment(content,memeId, req.user.id);
    res.status(201).json({ comment, message });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /memes/{memeId}/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     description: Allows the comment author to update their comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the meme the comment belongs to
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Actually, this meme made my day!"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     content:
 *                       type: string
 *                     MemeId:
 *                       type: string
 *                       format: uuid
 *                     UserId:
 *                       type: string
 *                       format: uuid
 *                 message:
 *                   type: string
 *                   example: "Comment updated successfully"
 *       400:
 *         description: Missing required data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required data"
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
 *         description: Forbidden (not your comment)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Comment not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred while updating the comment"
 */
commentRouter.put('/:commentId', ensureUsersModifyOnlyTheirComments, async (req, res, next) => {
  const { memeId, commentId } = req.params;
  const { content } = req.body;

  try {
    const { comment, message } = await CommentController.updateComment(content, commentId, req.user.id);
    res.json({ comment, message });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /memes/{memeId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Allows the comment's author to delete their comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the meme the comment belongs to
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the comment to delete
 *     responses:
 *       204:
 *         description: Comment deleted successfully (no content)
 *       400:
 *         description: Missing required data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required data"
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
 *         description: Forbidden (not your comment)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Comment not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred while updating the comment"
 */
commentRouter.delete('/:commentId', ensureUsersModifyOnlyTheirComments, async (req, res, next) => {
  const { memeId, commentId } = req.params;

  try {
    await CommentController.deleteComment(commentId);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});
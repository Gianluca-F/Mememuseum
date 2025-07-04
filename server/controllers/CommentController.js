import { Meme, User, Comment, MemeOfTheDay, Vote } from "../data/Database.js";

//TODO: Check with swagger if the routes are correct
export class CommentController {

  static async createComment({ content, userId, memeId }) {
    // Validate input
    if (!content || !userId || !memeId) {
      throw { status: 400, error: 'Content, user ID, and meme ID are required' };
    }

    // Create the comment
    const comment = await Comment.create({
      content,
      UserId: userId,
      MemeId: memeId
    });

    return comment;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async getCommentsByMemeId(memeId) {
    if (!memeId) {
      throw { status: 400, error: 'Meme ID is required' };
    }

    const comments = await Comment.findAll({
      where: { MemeId: memeId },
      include: [
        {
          model: User,
          attributes: ['id', 'userName'],
          required: true
        }
      ]
    });

    return comments;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async deleteComment(commentId, userId) {
    if (!commentId || !userId) {
      throw { status: 400, error: 'Comment ID and user ID are required' };
    }

    // Find the comment
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      throw { status: 404, error: 'Comment not found' };
    }

    // Check if the user is the author of the comment
    if (comment.UserId !== userId) {
      throw { status: 403, error: 'You are not authorized to delete this comment' };
    }

    // Delete the comment
    await comment.destroy();

    return { message: 'Comment deleted successfully' };
  }
}
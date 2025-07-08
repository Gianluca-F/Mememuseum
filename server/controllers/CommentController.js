import { Meme, User, Comment, MemeOfTheDay, Vote, database } from "../data/Database.js";

export class CommentController {

  static async createComment(content, memeId, userId) {
    if (!content || !memeId || !userId) {
      throw { status: 400, message: 'Missing required data' };
    }

    const transaction = await database.transaction();

    try {
      const newComment = await Comment.create({
        content: content.trim(),
        MemeId: memeId,
        UserId: userId,
      }, { transaction });

      await transaction.commit();
      return { comment: newComment.toJSON(), message: 'Comment created successfully' };
    } catch (err) {
      await transaction.rollback();

      if (err.name === 'SequelizeValidationError') {
        throw { status: 400, message: 'Invalid comment content' };
      }
      if( err.name === 'SequelizeForeignKeyConstraintError') {
        throw { status: 409, message: "User or Meme not found" };
      }
      throw { status: 500, message: "An unexpected error occurred while creating the comment" };
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async updateComment(content, commentId, userId) {
    if (!content || !commentId || !userId) {
      throw { status: 400, message: 'Missing required data' };
    }

    const comment = await Comment.findByPk(commentId, {
      include: [ // Include the User for the response
        { 
          model: User, 
          attributes: ['id', 'userName'],
          required: true
        }
      ]
    });

    if (!comment) {
      throw { status: 404, message: 'Comment not found' };
    }

    try {
      // Update the comment
      comment.content = content.trim();
      await comment.save();

      return { comment: comment.toJSON(), message: 'Comment updated successfully' };
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        throw { status: 400, message: 'Invalid comment content' };
      }
      throw { status: 500, message: 'An unexpected error occurred while updating the comment' };
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async deleteComment(commentId) {
    if (!commentId) {
      throw { status: 400, message: 'Comment ID is required' };
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw { status: 404, message: 'Comment not found' };
    }

    const transaction = await database.transaction();

    try {
      await comment.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw { status: 500, message: 'An unexpected error occurred while deleting the comment' };
    }
  }
}
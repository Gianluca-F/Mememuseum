import { Meme, User, Comment, MemeOfTheDay, Vote, database } from "../data/Database.js";
import { Op } from "sequelize";
import { normalizeTags } from "../utils/tagsHelper.js";
import fs from "fs/promises";
import path from "path";

export class MemeController {

  static async getAllMemes({ page = 1, limit = 10, title = '', tags, match = 'any',sortedBy = 'createdAt', sortDirection = 'DESC' }) {
    const validatedPage = Math.max(1, parseInt(page) || 1);
    const validatedLimit = Math.min(Math.max(1, parseInt(limit) || 10), 50);
    const offset = (validatedPage - 1) * validatedLimit;

    // Dynamic filtering based on req.query parameters
    const where = {};

    if (title && title.trim()) { // Check if title is provided and not just whitespace
      where.title = { [Op.iLike]: `%${title.trim()}%` };
    }

    const cleanedTags = normalizeTags(tags);

    if (cleanedTags.length > 0) {
      where.tags = match === 'all'
        ? { [Op.contains]: cleanedTags } // Match all tags
        : { [Op.overlap]: cleanedTags }; // Match any tags
    }

    // Validate sortedBy and sortDirection
    const orderedBy = ['createdAt', 'upvotes', 'downvotes', 'commentsCount'].includes(sortedBy)
      ? sortedBy
      : 'createdAt';

    const direction = ['ASC', 'DESC'].includes(sortDirection.toUpperCase())
      ? sortDirection.toUpperCase()
      : 'DESC';

    const order = [[orderedBy, direction]];

    // Ensure that the User model is included to fetch user details
    const include = [
      {
        model: User,
        attributes: ['id', 'userName'],
        required: true,
      },
    ];

    // Using findAndCountAll to get both data and total count for pagination
    const { rows: memes, count } = await Meme.findAndCountAll({
      where,
      include,
      limit: validatedLimit,
      offset,
      order,
    });

    const formattedMemes = memes?.map(meme => ({
      id: meme.id,
      title: meme.title,
      imageUrl: meme.imageUrl,
      description: meme.description,
      tags: meme.tags,
      upvotes: meme.upvotes,
      downvotes: meme.downvotes,
      commentsCount: meme.commentsCount,
      createdAt: meme.createdAt,
      user: {
        id: meme.User.id,
        userName: meme.User.userName,
      },
    }));

    return {
      data: formattedMemes,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        totalItems: count,
        totalPages: Math.ceil(count / validatedLimit),
        hasNextPage: offset + validatedLimit < count,
        hasPreviousPage: validatedPage > 1,
      },
    };
    
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async getMemeById(id) {
    if (!id) {
      throw { status: 400, message: "Meme ID is required" };
    }

    const meme = await Meme.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'userName'],
          required: true
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'userName'],
              required: true
            }
          ],
        }
      ]
    });

    if (!meme) {
      throw { status: 404, message: "Meme not found" };
    }

    /*
    const formattedComments = meme.Comments?.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        id: comment.User.id,
        userName: comment.User.userName
      }
    }));

    return {
      id: meme.id,
      title: meme.title,
      imageUrl: meme.imageUrl,
      description: meme.description,
      tags: meme.tags,
      upvotes: meme.upvotes,
      downvotes: meme.downvotes,
      commentsCount: meme.commentsCount,
      createdAt: meme.createdAt,
      user: {
        id: meme.User.id,
        userName: meme.User.userName,
      },
      comments: formattedComments
    };
    */
    return meme.toJSON(); //??? Works as expected?
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async getMemeOfTheDay() {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    // Verify if a meme of the day already exists for today
    const memeOfTheDay = await MemeOfTheDay.findOne({ where: { date: today } });

    if (memeOfTheDay) {
      return memeOfTheDay.MemeId; // Return the existing meme ID
    }

    // If it doesn't exist yet: select the best meme of the day

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    let memes = await Meme.findAll({
      where: {
        createdAt: {
          [Op.gte]: twoWeeksAgo, // Only consider memes created in the last 14 days
        },
      },
    });

    if (!memes || memes.length === 0) {
      memes = await Meme.findAll(); // If no memes in the last 14 days, fallback to all memes
    }

    if (!memes || memes.length === 0) {
      throw { status: 404, message: "No memes available to select as meme of the day" };
    }

    // Choose a random meme
    const randomIndex = Math.floor(Math.random() * memes.length);
    const memeId = memes[randomIndex].id;

    // Save the meme of the day in the caching table
    await MemeOfTheDay.create({
      date: today,
      MemeId: memeId,
    });

    return memeId;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async createMeme(memeData, userId) {
    if (!memeData || !memeData.title || !memeData.imageUrl || !userId) {
      throw { status: 400, message: "Missing required data" };
    }

    memeData.title = memeData.title.trim();
    memeData.description = memeData.description?.trim();
    memeData.tags = normalizeTags(memeData.tags);

    try {
      const newMeme = await Meme.create({
        ...memeData,
        UserId: userId
      });

      return newMeme.toJSON(); //??? Works as expected?
    } catch (err) {
      // Remove meme saved in uploads/ by the multer middleware
      if (memeData.imageUrl) {
        const filePath = path.join(process.cwd(), memeData.imageUrl);
        try {
          await fs.unlink(filePath);
        } catch (fsErr) {
          console.error(`Failed to delete file ${filePath}:`, fsErr);
        }
      }
      if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
        throw { status: 400, message: "Invalid meme data" };
      }
      if( err.name === 'SequelizeForeignKeyConstraintError') {
        throw { status: 409, message: "User not found" };
      }
      throw { status: 500, message: "An unexpected error occurred while creating the meme" };
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async updateMeme(memeId, memeData, userId) {
    if (!memeId || !memeData || !userId) {
      throw { status: 400, message: "Missing required data" };
    }

    // Trim and normalize meme data
    if (memeData.title) memeData.title = memeData.title.trim();
    if (memeData.description) memeData.description = memeData.description.trim();
    if (memeData.tags) memeData.tags = normalizeTags(memeData.tags);
    
    const meme = await Meme.findByPk(memeId);
    if (!meme) {
      throw { status: 404, message: "Meme not found" };
    }

    try {

      // If the imageUrl is updated, delete the old image file
      if (memeData.imageUrl && meme.imageUrl) {
        const oldPath = path.join(process.cwd(), meme.imageUrl);
        try {
          await fs.unlink(oldPath);
        } catch (fsErr) {
          console.error(`Failed to delete file ${oldPath}:`, fsErr);
        }
      }

      // Update the meme
      meme.set(memeData);
      await meme.save();

      return meme.toJSON();
    } catch (err) {
      // Remove meme saved in uploads/ by the multer middleware
      if (memeData.imageUrl) {
        const filePath = path.join(process.cwd(), memeData.imageUrl);
        try {
          await fs.unlink(filePath);
        } catch (fsErr) {
          console.error(`Failed to delete file ${filePath}:`, fsErr);
        }
      }
      if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
        throw { status: 400, message: "Invalid meme data" };
      }
      throw { status: 500, message: "An unexpected error occurred while updating the meme" };
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async deleteMeme(memeId) {
    if (!memeId) {
      throw { status: 400, message: "Meme ID is required" };
    }

    const meme = await Meme.findByPk(memeId);
    if (!meme) {
      throw { status: 404, message: "Meme not found" };
    }

    // Delete the image file associated with the meme
    if (meme.imageUrl) {
      const filePath = path.join(process.cwd(), meme.imageUrl);
      try {
        await fs.unlink(filePath);
      } catch (fsErr) {
        console.error(`Failed to delete file ${filePath}:`, fsErr);
      }
    }

    await meme.destroy();
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  static async voteMeme(memeId, type, userId) {
    if (!['upvote', 'downvote'].includes(type)) {
      throw { status: 400, message: 'Invalid vote type. Must be "upvote" or "downvote"' };
    }

    const transaction = await database.transaction();

    const meme = await Meme.findByPk(memeId, { transaction });
    if (!meme) {
      throw { status: 404, message: 'Meme not found' };
    }

    const existingVote = await Vote.findOne({
      where: { MemeId: memeId, UserId: userId },
      transaction
    });

    try {
      let message;
      if (!existingVote) {
        await Vote.create({ type, MemeId: memeId, UserId: userId }, { transaction });
        message = `Vote recorded as ${type}`;
      } else if (existingVote.type === type) {
        await existingVote.destroy({ transaction });
        message = `Vote removed`;
      } else {
        existingVote.type = type;
        await existingVote.save({ transaction });
        message = `Vote updated to ${type}`;
      }

      await transaction.commit();
      return { meme: await meme.reload(), message };

    } catch (err) {
      await transaction.rollback();

      if (err.name === 'SequelizeValidationError') {
        throw { status: 400, message: 'Invalid vote data' };
      }
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        throw { status: 400, message: 'Invalid meme or user reference' };
      }
      throw { status: 500, message: 'An error occurred while processing the vote' };
    }
  }

}
import { Meme, User } from "../data/Database";
import { Op } from "sequelize";

export class MemeController {

  static async getAllMemes({ page = 1, limit = 10, title = '', tags = [], match = 'any',sortedBy = 'createdAt', sortDirection = 'DESC' }) {
    const validatedPage = Math.max(1, parseInt(page) || 1);
    const validatedLimit = Math.min(Math.max(1, parseInt(limit) || 10), 50);
    const offset = (validatedPage - 1) * validatedLimit;

    // Dynamic filtering based on req.query parameters
    const where = {};

    if (title && title.trim()) { // Check if title is provided and not just whitespace
      where.title = { [Op.iLike]: `%${title.trim()}%` };
    }

    if (tags && tags.length > 0) { // Check if tags are provided
      const cleanedTags = tags.map(tag => tag.toLowerCase().trim()).filter(Boolean);

      where.tags = match === 'all'
        ? { [Op.contains]: cleanedTags } // Match all tags
        : { [Op.overlap]: cleanedTags }; // Match any tags
    }

    // Validate sortedBy and sortDirection
    const orderedBy = ['createdAt', 'upvotesNumber', 'downvotesNumber', 'commentsNumber'].includes(sortedBy)
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

    const formattedMemes = memes.map(meme => ({
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
          required: true,
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'createdAt'],
          include: {
            model: User,
            attributes: ['id', 'userName'],
            required: true
          }
        }
      ]
    });

    if (!meme) {
      throw { status: 404, message: "Meme non trovato" };
    }
    
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
      comments: meme.Comments || []
    };
  }
}
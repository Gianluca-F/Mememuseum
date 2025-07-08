import { DataTypes } from 'sequelize';
import { Meme } from '../Database.js';

export function createModel(database) {
  database.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },

  {
    hooks: {

      afterCreate: async (comment, options) => {
        await Meme.increment('commentsCount', {
          by: 1,
          where: { id: comment.MemeId },
          transaction: options.transaction
        });
      },

      afterDestroy: async (comment, options) => {
        await Meme.decrement('commentsCount', {
          by: 1,
          where: { id: comment.MemeId },
          transaction: options.transaction
        });
      }

    }
  });
}

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
        const { transaction } = options;
        const meme = await Meme.findByPk(comment.MemeId);
        await meme.increment('commentsCount', { transaction });
      },

      afterDestroy: async (comment, options) => {
        const { transaction } = options;
        const meme = await Meme.findByPk(comment.MemeId);
        await meme.decrement('commentsCount', { transaction });
      }

    }
  });
}

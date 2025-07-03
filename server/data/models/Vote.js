// models/Vote.js
import { DataTypes } from 'sequelize';
import { Meme } from '../Database.js';

export function createModel(database) {
  database.define('Vote', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('upvote', 'downvote'),
      allowNull: false,
    }
  }, {

    indexes: [
      {
        unique: true,
        fields: ['UserId', 'MemeId']
      }
    ],

    hooks: {

      afterCreate: async (vote, options) => {
        const { transaction } = options;
        const meme = await Meme.findByPk(vote.MemeId);

        if (vote.type === 'upvote') {
          await meme.increment('upvotes', { transaction });
        } else {
          await meme.increment('downvotes', { transaction });
        }
      },

      afterUpdate: async (vote, options) => {
        const { transaction } = options;
        const meme = await Meme.findByPk(vote.MemeId);

        if (vote.previous('type') !== vote.type) {
          if (vote.type === 'upvote') {
            await Promise.all([
              meme.increment('upvotes', { transaction }),
              meme.decrement('downvotes', { transaction })
            ]);
          } else {
            await Promise.all([
              meme.decrement('upvotes', { transaction }),
              meme.increment('downvotes', { transaction })
            ]);
          }
        }
      },

      afterDestroy: async (vote, options) => {
        const { transaction } = options;
        const meme = await Meme.findByPk(vote.MemeId);

        if (vote.type === 'upvote') {
          await meme.decrement('upvotes', { transaction });
        } else {
          await meme.decrement('downvotes', { transaction });
        }
      }
    }
  });
}
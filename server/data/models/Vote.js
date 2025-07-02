// models/Vote.js
import { DataTypes } from 'sequelize';
import { Meme } from '../Database.js'; // Adjust the import path as necessary

export function createModel(database) {
  database.define('Vote', {
    type: {
      type: DataTypes.ENUM('upvote', 'downvote'),
      allowNull: false,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    MemeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    }
  }, {
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

        console.log("Updating vote type:", vote.type);
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
      }
    }
  });
}
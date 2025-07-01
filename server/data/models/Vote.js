// models/Vote.js
import { DataTypes } from 'sequelize';

export function createModel(database) {
  database.define('Vote', {
    type: {
      type: DataTypes.ENUM('upvote', 'downvote'),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    memeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    }
  });
}

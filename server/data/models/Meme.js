import { DataTypes } from 'sequelize';

export function createModel(database) {
  database.define('Meme', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true // Ensure that each meme has a unique image URL
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // works only with PostgreSQL
      allowNull: true,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    downvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    commentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    }
  });
}

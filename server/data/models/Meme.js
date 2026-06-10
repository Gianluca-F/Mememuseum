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
      allowNull: false,
      validate: { len : [1, 120] }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { len : [0, 1000] }
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true // Ensure that each meme has a unique image URL
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // works only with PostgreSQL
      allowNull: true,
      validate: {
        maxTags(value) {
          if (value && value.length > 10) {
            throw new Error('A meme can have at most 10 tags');
          }
        },
        tagLength(value) {
          if (value && value.some(tag => tag.length > 30)) {
            throw new Error('Each tag can be at most 30 characters long');
          }
        }
      }
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

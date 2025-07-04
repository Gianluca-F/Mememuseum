import { DataTypes } from "sequelize";

export function createModel(database) {
  database.define('MemeOfTheDay', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      unique: true,
    },
  }, {
    tableName: 'MemesOfTheDay',
    freezeTableName: true, // Prevents Sequelize from pluralizing the table name
    timestamps: false, // No createdAt or updatedAt fields
  });
}
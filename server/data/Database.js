import { Sequelize } from 'sequelize';
import 'dotenv/config.js'; // Load environment variables from .env file

import { createModel as createUserModel } from "./models/User.js";
import { createModel as createMemeModel } from "./models/Meme.js";
import { createModel as createCommentModel } from "./models/Comment.js";
import { createModel as createVoteModel } from "./models/Vote.js";

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
  dialect: process.env.DIALECT || "postgres",
});

// create models
createUserModel(database);
createMemeModel(database);
createCommentModel(database);
createVoteModel(database);

export const { User, Meme, Comment, Vote } = database.models;


// associations configuration

// User 1 to Many Meme
User.Memes = User.hasMany(Meme, { 
  foreignKey: { allowNull: false, onDelete: 'CASCADE' }
});
Meme.User = Meme.belongsTo(User, {
  foreignKey: { allowNull: false, onDelete: 'CASCADE' }
});

// User 1 to Many Comment
User.Comments = User.hasMany(Comment, { 
  foreignKey: { allowNull: false, onDelete: 'CASCADE' } 
});
Comment.User = Comment.belongsTo(User, {
  foreignKey: { allowNull: false, onDelete: 'CASCADE' }
});

// Meme 1 to Many Comment
Meme.Comments = Meme.hasMany(Comment, { 
  foreignKey: { allowNull: false, onDelete: 'CASCADE' }
});
Comment.Meme = Comment.belongsTo(Meme, { 
  foreignKey: { allowNull: false, onDelete: 'CASCADE' }
});

// User 1 to Many Vote
User.Votes = User.hasMany(Vote, { 
  foreignKey: { allowNull: false, onDelete: 'CASCADE' }
});
Vote.User = Vote.belongsTo(User, {
  foreignKey: { allowNull: false, onDelete: 'CASCADE' }
});

// Meme 1 to Many Vote
Meme.Votes = Meme.hasMany(Vote, { 
  foreignKey: { allowNull: false, onDelete: 'CASCADE' }
});
Vote.Meme = Vote.belongsTo(Meme, {
  foreignKey: { allowNull: false, onDelete: 'CASCADE' }
});


// synchronize schema (creates missing tables)
database.sync({ alter: true }) // Use { alter: true } to update existing tables
  .then(() => {
    console.log("Database synced correctly");
  })
  .catch(err => {
    console.error("Error with database synchronization: " + err.message);
  });
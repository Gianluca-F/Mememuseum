import express from 'express';
import { MemeController } from '../controllers/MemeController.js';
//import { checkMemeAuthorization } from '../middleware/utils/authorization.js';
//import { uploader } from '../data/local/multerStorage/uploader.js';

export const commentRouter = express.Router();

//TODO: Implementare le rotte per i commenti
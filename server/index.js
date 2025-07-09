import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { authenticationRouter } from './routes/authenticationRouter.js';
import { memeRouter } from './routes/memeRouter.js';
import { commentRouter } from './routes/commentRouter.js';
import { apiDocsRouter } from './utils/swaggerUI.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authenticateToken } from './middlewares/authorization.js';
import { sanitizeInput } from './middlewares/sanitize.js';

// Configurazione dotenv per variabili ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per il logging delle richieste
app.use(morgan('dev'));

// Middleware di sicurezza
app.use(helmet());
app.use(cors());

// Middleware per il parsing del corpo delle richieste JSON
app.use(express.json());

// Serve i file statici dalla cartella uploads
app.use('/uploads', express.static('uploads'));

// Setup Swagger UI per la documentazione API in /api-docs
app.use(apiDocsRouter);

// Middleware per la sanitizzazione degli input
app.use(sanitizeInput); // NOTE: Verificare che non causi problemi

// Definizione delle routes
app.use('/auth', authenticationRouter);
app.use('/memes', memeRouter);
app.use('/memes/:memeId/comments', authenticateToken, commentRouter);

// Middleware per gestire gli errori
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

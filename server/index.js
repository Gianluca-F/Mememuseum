// Import delle dipendenze usando import (non require)
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { authenticationRouter } from './routes/authenticationRouter.js';
import { apiDocsRouter } from './utils/swaggerUI.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Configurazione dotenv per variabili ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per il logging delle richieste
app.use(morgan('dev'));

// Middleware di sicurezza
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(csurf({ cookie: true }));

// Middleware per il parsing
app.use(cookieParser());
app.use(express.json());

// Setup Swagger UI per la documentazione API in /api-docs
app.use(apiDocsRouter);

// Definizione delle routes
app.use('/auth', authenticationRouter);

// Middleware per gestire gli errori
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

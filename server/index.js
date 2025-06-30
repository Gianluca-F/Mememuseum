// Import delle dipendenze usando import (non require)
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Configurazione dotenv per variabili ambiente
dotenv.config();

// Ricostruzione di __dirname (non disponibile in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per il logging delle richieste
app.use(morgan('dev'));

// Middleware di sicurezza e parsing
app.use(helmet());
app.use(xss());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());

// CSRF protection (puoi attivarla o disattivarla secondo necessità)
app.use(csurf({ cookie: true }));

// Rotta base
app.get('/', (req, res) => {
  res.send('MEMEMUSEUM backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Import delle dipendenze usando import (non require)
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { authenticationRouter } from './routes/authenticationRouter.js';

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


//generate OpenAPI spec and show swagger ui
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Meme Museum API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*Router.js'], // files containing annotations
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


// Definizione delle routes
app.use('/auth', authenticationRouter);

//error handler
app.use( (err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

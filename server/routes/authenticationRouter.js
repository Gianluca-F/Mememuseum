import express from 'express';
import { AuthController } from '../controllers/AuthController.js';

export const authenticationRouter = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Autentica un utente
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Credenziali dell'utente per l'autenticazione
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: st0ck
 *               password:
 *                 type: string
 *                 example: seCurep4ass
 *     responses:
 *       200:
 *         description: Login avvenuto con successo
 *       401:
 *         description: Credenziali non valide
 */

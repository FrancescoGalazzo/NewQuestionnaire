// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserId, validateUserCreation } = require('../middleware/validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - questionnaire
 *       properties:
 *         id:
 *           type: integer
 *           description: ID dell'utente
 *         name:
 *           type: string
 *           description: Nome dell'utente
 *         questionnaire:
 *           type: integer
 *           description: Numero del questionario
 *       example:
 *         id: 1
 *         name: John Doe
 *         questionnaire: 1
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Recupera tutti gli utenti
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista di tutti gli utenti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *       500:
 *         description: Errore del server
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Recupera un utente tramite ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID dell'utente
 *     responses:
 *       200:
 *         description: Dettagli dell'utente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       404:
 *         description: Utente non trovato
 *       500:
 *         description: Errore del server
 */
router.get('/:id', validateUserId, userController.getUserById);


/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuovo utente
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - questionnaire
 *             properties:
 *               name:
 *                 type: string
 *               questionnaire:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *       400:
 *         description: Dati non validi
 */
router.post('/', validateUserCreation, userController.createUser);


module.exports = router;

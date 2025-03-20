const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaireController');
const { validateUserId, validateUserCreation } = require('../middleware/validator');

router.get('/:id/questions', questionnaireController.getAllQuestions);

module.exports = router;
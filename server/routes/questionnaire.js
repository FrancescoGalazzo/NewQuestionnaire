const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaireController');
const { validateAdminForQuestionnaire, validateQuestionnaireId } = require('../middleware/validator');

router.get('/:id/questions', questionnaireController.getAllQuestions);
router.get('/admins/:id', questionnaireController.getAllQuestionnaireByAdmin);
router.get('/', questionnaireController.getAllQuestionnaires);
router.post('/', validateAdminForQuestionnaire, questionnaireController.createQuestionnaire);
router.put('/', validateQuestionnaireId, questionnaireController.updateNumUsersQuestionnaire);


module.exports = router;
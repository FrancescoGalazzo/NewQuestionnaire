const questionnaireModel = require('../models/questionnaireModel');


const questionnaireController = {

    getAllQuestions : async (req, res) => {
        const questionnaireId = req.params.id;
        try {
          const questions = await questionnaireModel.getAllQuestions(questionnaireId);

          const formattedQuestions = questions.reduce((acc, row) => {
            const { question_id, question_text, question_type, is_required, option_id, option_text, option_position } = row;

            if (!acc[question_id]) {
              acc[question_id] = {
                id: question_id,
                text: question_text,
                type: question_type,
                required: is_required,
                options: []
              };
            }
      
            if (option_id) {
              acc[question_id].options.push({
                id: option_id,
                text: option_text,
                position: option_position
              });
            }
      
            return acc;
          }, {});
      
          res.json(Object.values(formattedQuestions));

          //res.json(questions);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      getAllQuestionnaireByAdmin : async (req, res) => {
        const adminId = req.params.id;
        try {
          const questionnairs = await questionnaireModel.getAllQuestionnaireByAdmin(adminId);
          res.json(questionnairs);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      getAllQuestionnaires : async (req, res) => {
    
        try {
          const questionnairs = await questionnaireModel.getAllQuestionnaires();
          res.json(questionnairs);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      createQuestionnaire : async (req, res) => {
        const questionnaire = {
          admin: req.body.admin,
          title: req.body.title,
          num_questions: req.body.num_questions
        };

        try {
          const questionnairs = await questionnaireModel.createQuestionnaire(questionnaire);
          res.json(questionnairs);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },

      updateNumUsersQuestionnaire : async (req, res) => {
        const questionnaire = {
          qid: req.body.qid
        };

        try {
          const questionnairs = await questionnaireModel.updateNumUsersQuestionnaire(questionnaire);
          res.json(questionnairs);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }


}

module.exports = questionnaireController;
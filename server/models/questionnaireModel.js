'use strict';

const db = require('../config/database');

const questionnaireModel = {
    getAllQuestions: (questionnaireId) => {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT 
                q.did AS question_id,
                q.query AS question_text,
                q.type AS question_type,
                q.required AS is_required,
                qo.id AS option_id,
                qo.option_text AS option_text,
                qo.position AS option_position
            FROM 
                questions q
            LEFT JOIN 
                question_options qo 
            ON 
                q.did = qo.question
            WHERE 
                q.questionnaire = ?;
          `;
        
          db.all(query, [questionnaireId], (err, rows) => {
            if (err) {
              console.error(err.message);
              res.status(500).json({ error: 'Errore durante il recupero delle domande.' });
              return;
            }

            resolve(rows);
            
        });
        
        
        
        });


    }
};

module.exports = questionnaireModel

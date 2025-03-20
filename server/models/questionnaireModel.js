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
            console.log(rows);
            resolve(rows);
            
        });
        
        
        
        });
    },

    getAllQuestionnaireByAdmin : (adminId) => {
        return new Promise((resolve, reject) => {
      
          const sql = "SELECT * FROM questionnaires WHERE admin=?";
          db.all(sql, [adminId], (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            if (rows == undefined) {
              resolve({ error: 'Task not found.' });
            } else {
              const questionnairs = rows.map(t => ({
                qid: t.qid,
                title: t.title,
                numquestions: t.num_questions,
                numusers: t.num_users
              }))
              resolve(questionnairs);
            }
          });
        });
    },

    getAllQuestionnaires: async ()=>{
      return new Promise((resolve, reject) => {
      
        const sql = "SELECT * FROM questionnaires";
        db.all(sql, [], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          if (rows == undefined) {
            resolve({ error: 'Task not found.' });
          } else {
            const questionnairs = rows.map(t => ({
              qid: t.qid,
              title: t.title,
              numquestions: t.num_questions,
              numusers: t.num_users
            }))
            resolve(questionnairs);
          }
        });
      });

    },

    createQuestionnaire : (questionnaire) => {
      return new Promise((resolve, reject) => {
        const sql = `INSERT INTO questionnaires (admin, title, num_questions) VALUES(?, ?, ?)`;
        db.run(sql, [questionnaire.admin, questionnaire.title, questionnaire.num_questions], function (err) {
          if (err) {
            reject(err);
          }
          resolve(this.lastID);
          //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
      });
    },

    updateNumUsersQuestionnaire : (questionnaire) => {
      return new Promise((resolve, reject) => {
        const sql = `UPDATE questionnaires SET num_users=num_users+1 WHERE qid=?`;
        db.run(sql, [questionnaire.qid], function (err) {
          if (err) {
            reject(err);
          }
          resolve(this.lastID);
          //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
      });
    }
      
};

module.exports = questionnaireModel

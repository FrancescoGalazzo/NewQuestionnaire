'use strict';

const db = require('../config/database');

const userModel = {

  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

 createUser: (userData) => {
    return new Promise((resolve, reject) => {
      const { name, questionnaire } = userData;
      db.run('INSERT INTO users (name, questionnaire) VALUES (?, ?)', 
        [name, questionnaire], 
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, questionnaire });
          }
        }
      );
    });
  }


};


module.exports = userModel;

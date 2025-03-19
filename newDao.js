'use strict';
const db = require('../config/database');

// Obtain all the questions of an idAdmin admin
exports.getQuestionsByAdmin = (idAdmin) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT q.did, q.query, q.type, q.required, q.min, q.max, qn.title AS questionnaire_title
		FROM questions q
		JOIN questionnaires qn ON q.questionnaire = qn.qid
		JOIN admin a ON qn.admin = a.id
		WHERE a.id = ?`;
    db.all(sql, [idAdmin], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        resolve(rows);
      }
    });
  });
};

// Ottiene tutte le domande
exports.getTutteDomande = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM domande`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        resolve(rows);
      }
    });
  });
};

// Ottiene le opzioni per le domande di un questionario
exports.getOptions = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT d.did, d.quesito, d.tipo, o.id AS opzione_id, o.testo_opzione, o.posizione
                FROM domande d
                LEFT JOIN opzioni_domanda o ON d.did = o.domanda
                WHERE d.questionario = ?
                ORDER BY d.did, o.posizione`;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        resolve(rows);
      }
    });
  });
};

// Ottiene tutti i questionari di un admin
exports.getAllMyQuestionnaire = (admin) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM questionari WHERE admin=?";
    db.all(sql, [admin], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        const questionari = rows.map(t => ({
          qid: t.qid,
          titolo: t.titolo,
          numdomande: t.numdomande,
          numutenti: t.numutenti
        }));
        resolve(questionari);
      }
    });
  });
};

// Ottiene tutti i questionari
exports.getAllQuestionnaires = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM questionari";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        const questionari = rows.map(t => {
          return {
            qid: t.qid,
            titolo: t.titolo,
            admin: t.admin,
            numdomande: t.numdomande,
            numutenti: t.numutenti
          };
        });
        resolve(questionari);
      }
    });
  });
};

// Crea un nuovo questionario
exports.createQuestionario = (quest) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO questionari (admin, titolo, numdomande) VALUES(?, ?, ?)`;
    db.run(sql, [quest.admin, quest.titolo, quest.numdomande], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
    });
  });
};

// Inserisce una domanda a risposta aperta
exports.inserisciDomandeAperta = (domanda) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO domande(questionario, quesito, tipo, obbligatoria, min, max) VALUES(?,?,?,?,?,?)";
    db.run(sql, [domanda.qid, domanda.quesito, domanda.tipo, domanda.obbligatoria, domanda.min, domanda.max], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
    });
  });
};

// Inserisce una domanda a risposta chiusa
exports.inserisciDomandeChiusa = (domanda) => {
  return new Promise((resolve, reject) => {
    // Prima inseriamo la domanda
    const sql = "INSERT INTO domande(questionario, quesito, tipo, obbligatoria, min, max) VALUES(?,?,?,?,?,?)";
    db.run(sql, [domanda.qid, domanda.quesito, domanda.tipo, domanda.obbligatoria, domanda.min, domanda.max], function (err) {
      if (err) {
        reject(err);
        return;
      }
      
      const domandaId = this.lastID;
      const opzioni = [];
      
      // Raccogliamo tutte le opzioni non nulle
      for (let i = 1; i <= 10; i++) {
        const opzioneKey = `opzione${i}`;
        if (domanda[opzioneKey]) {
          opzioni.push({
            testo: domanda[opzioneKey],
            posizione: i
          });
        }
      }
      
      // Se non ci sono opzioni, risolviamo subito
      if (opzioni.length === 0) {
        resolve(domandaId);
        return;
      }
      
      // Inseriamo tutte le opzioni
      let completed = 0;
      opzioni.forEach(opzione => {
        const sqlOpzione = "INSERT INTO opzioni_domanda(domanda, testo_opzione, posizione) VALUES(?,?,?)";
        db.run(sqlOpzione, [domandaId, opzione.testo, opzione.posizione], function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          completed++;
          if (completed === opzioni.length) {
            resolve(domandaId);
          }
        });
      });
    });
  });
};

// Inserisce un nuovo utente
exports.inserisciUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO utenti (nome, questionario) VALUES(?,?)`;
    db.run(sql, [user.nome, user.questionario], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
    });
  });
};

// Inserisce una risposta
exports.inserisciRisposte = (risposta) => {
  return new Promise((resolve, reject) => {
    // Prima inseriamo la risposta principale
    const sql = `INSERT INTO risposte (domanda, utente, risposta_aperta) VALUES(?,?,?)`;
    db.run(sql, [risposta.domanda, risposta.user, risposta.opzioneaperta], function (err) {
      if (err) {
        reject(err);
        return;
      }
      
      const rispostaId = this.lastID;
      
      // Se è una risposta aperta o non ci sono opzioni selezionate, terminiamo
      if (risposta.tipo === 1 || risposta.numrisposte === 0) {
        resolve(rispostaId);
        return;
      }
      
      // Raccogliamo tutte le opzioni selezionate
      const opzioniSelezionate = [];
      for (let i = 1; i <= 10; i++) {
        const opzioneKey = `opzione${i}`;
        if (risposta[opzioneKey]) {
          opzioniSelezionate.push(risposta[opzioneKey]);
        }
      }
      
      // Se non ci sono opzioni selezionate, risolviamo subito
      if (opzioniSelezionate.length === 0) {
        resolve(rispostaId);
        return;
      }
      
      // Inseriamo tutte le opzioni selezionate
      let completed = 0;
      opzioniSelezionate.forEach(opzioneId => {
        const sqlOpzione = "INSERT INTO risposte_opzioni(risposta, opzione_scelta) VALUES(?,?)";
        db.run(sqlOpzione, [rispostaId, opzioneId], function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          completed++;
          if (completed === opzioniSelezionate.length) {
            resolve(rispostaId);
          }
        });
      });
    });
  });
};

// Aggiorna il numero di utenti di un questionario
exports.aggiornaNumUtenti = (qid) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE questionari SET numutenti=numutenti+1 WHERE qid=?`;
    db.run(sql, [qid.qid], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.changes);
    });
  });
};

// Aggiorna il numero di domande di un questionario
exports.aggiornaNumDomande = (questionario) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE questionari SET numdomande=? WHERE qid=?`;
    db.run(sql, [questionario.numdomande, questionario.qid], function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.changes);
    });
  });
};

// Ottiene le risposte di un utente a un questionario
exports.ottieniRisposteDaUtente = (utente) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT r.id, r.domanda, r.risposta_aperta, d.tipo, d.quesito,
             GROUP_CONCAT(od.testo_opzione, '|') as opzioni_selezionate
      FROM risposte r
      INNER JOIN domande d ON r.domanda = d.did
      INNER JOIN utenti u ON r.utente = u.id
      LEFT JOIN risposte_opzioni ro ON r.id = ro.risposta
      LEFT JOIN opzioni_domanda od ON ro.opzione_scelta = od.id
      WHERE d.questionario = ? AND u.id = ?
      GROUP BY r.id
    `;
    
    db.all(sql, [utente.questionario, utente.utente], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        resolve(rows);
      }
    });
  });
};

// Ottiene gli utenti che hanno risposto ai questionari di un admin
exports.ottieniUtentiDatoAdmin = (admin) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT u.*
      FROM questionari q
      INNER JOIN admin a ON q.admin = a.id
      INNER JOIN utenti u ON u.questionario = q.qid
      WHERE a.id = ?
    `;
    
    db.all(sql, [admin.admin], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        resolve(rows);
      }
    });
  });
};

// Cancella un questionario
exports.cancellaQuestionario = function(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM questionari WHERE qid = ?';
    db.run(sql, [id], function(err) {
      if (err)
        reject(err);
      else 
        resolve("Task removed successfully");
    });
  });
};

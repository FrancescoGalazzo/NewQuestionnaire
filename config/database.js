'use strict';

const sqlite = require('sqlite3').verbose();

const path = require('path');

// Percorso al file del database
const dbPath = path.resolve(__dirname, '../database/table.db');

// open the database
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

module.exports = db;

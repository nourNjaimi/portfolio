const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create tasks table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL CHECK (completed IN (0, 1))
)`);

// Create notes table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL
)`);


function modifyNote(id, updates) {
  db.run(`UPDATE notes SET title = ?, content = ? WHERE id = ?`, [updates.title, updates.content, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    // get the updated note
    db.get(`SELECT * FROM notes WHERE id = ?`, [id], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(row);
    });
  });
}


module.exports = db; 

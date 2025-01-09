const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./database'); // Import the database connection

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// API endpoint to get tasks from the database
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to add a task to the database
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  const sql = 'INSERT INTO tasks (title, completed) VALUES (?, ?)';
  const params = [title, false];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(201).json({
      id: this.lastID,
      title,
      completed: false,
    });
  });
});

// Modify a note
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Update the note
  db.run(`UPDATE notes SET title = ?, content = ? WHERE id = ?`, [title, content, id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error updating note' });
    }

    // Return the updated note
    db.get(`SELECT * FROM notes WHERE id = ?`, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching updated note' });
      }
      res.json(row);
    });
  });
});

// Modify a task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  // Update the task
  db.run(`UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?`, [title, description, completed, id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error updating task' });
    }

    // Return the updated task
    db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching updated task' });
      }
      res.json(row);
    });
  });
});

// API endpoint to delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// API endpoint to get notes from the database
app.get('/api/notes', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to add a note to the database
app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  console.log('Received content:', content); // Debugging log
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  const timestamp = new Date().toISOString(); // Get current date and time
  const sql = 'INSERT INTO notes (content, timestamp) VALUES (?, ?)';
  const params = [content, timestamp];
  db.run(sql, params, function (err) {
    if (err) {
      console.error('Database error:', err.message); // Debugging log
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(201).json({
      id: this.lastID,
      content,
      timestamp,
    });
  });
});

// API endpoint to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM notes WHERE id = ?';
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Note deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
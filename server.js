const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Root URL par index.html bhejane ke liye
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Search API Route
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);

        const result = await pool.query(
            `SELECT title, 'expense' as type FROM expenses WHERE title ILIKE $1 
            UNION 
            SELECT title, 'note' as type FROM notes WHERE title ILIKE $1`,
            [`%${query}%`]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get all tasks / notes (GET) - Email filter ke sath
app.get('/api/tasks', async (req, res) => {
    try {
        const { email } = req.query;
        let result;
        if (email) {
            result = await pool.query('SELECT * FROM notes WHERE user_email = $1 ORDER BY id DESC', [email]);
        } else {
            result = await pool.query('SELECT * FROM notes ORDER BY id DESC');
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Save Task Route (POST) - Email ke sath save hoga
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, email } = req.body;
        const newNote = await pool.query(
            "INSERT INTO notes (title, user_email) VALUES ($1, $2) RETURNING *",
            [title, email]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Delete Task/Note Route (DELETE)
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM notes WHERE id = $1', [id]);
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// --- EXPENSES ROUTES ---

// 1. Get all expenses (GET) - Email filter ke sath
app.get('/api/expenses', async (req, res) => {
    try {
        const { email } = req.query;
        let result;
        if (email) {
            result = await pool.query('SELECT * FROM expenses WHERE user_email = $1 ORDER BY id DESC', [email]);
        } else {
            result = await pool.query('SELECT * FROM expenses ORDER BY id DESC');
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 2. Save new expense (POST) - Email ke sath save hoga
app.post('/api/expenses', async (req, res) => {
    try {
        const { title, amount, email } = req.body;
        const newExpense = await pool.query(
            "INSERT INTO expenses (title, amount, user_email) VALUES ($1, $2, $3) RETURNING *",
            [title, amount, email]
        );
        res.json(newExpense.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 3. Delete expense (DELETE)
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Server Listen
const PORT = process.env.PORT || 3000;

// Vercel ke liye app export karna zaroori hai, local ke liye app.listen
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
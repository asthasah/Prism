const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// Save Task Route
app.post('/api/tasks', async (req, res) => {
    try {
        const { title } = req.body;
        const newNote = await pool.query(
            "INSERT INTO notes (title) VALUES ($1) RETURNING *",
            [title]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Save Expense Route
app.post('/api/expenses', async (req, res) => {
    try {
        const { title, amount } = req.body;
        const newExpense = await pool.query(
            "INSERT INTO expenses (title, amount) VALUES ($1, $2) RETURNING *",
            [title, amount]
        );
        res.json(newExpense.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
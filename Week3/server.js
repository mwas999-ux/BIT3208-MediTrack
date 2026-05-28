
require('dotenv').config();
const express = require('express');
const db      = require('./db');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/register', (req, res) => {
    const { fullname, age, gender, phone, email, password } = req.body;

    db.query(
        'INSERT INTO patients (fullname, age, gender, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)',
        [fullname, age, gender, phone, email, password],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: 'Registration failed' });
            }
            res.json({ success: true, message: 'Patient registered successfully' });
        }
    );
});


app.get('/patients', (req, res) => {
    db.query('SELECT * FROM patients ORDER BY id DESC', (err, rows) => {
        if (err) return res.json([]);
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(` MediTrack Week 3 running at http://localhost:${PORT}`);
});
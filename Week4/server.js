
require('dotenv').config();
const express      = require('express');
const jwt          = require('jsonwebtoken');
const bcrypt       = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path         = require('path');
const db           = require('./db');
const verifyToken  = require('./middleware/auth');

const app  = express();
const PORT = process.env.PORT || 5001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.get('/', (req, res) => res.redirect('/login'));


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, rows) => {
        if (err || rows.length === 0) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const admin = rows[0];
        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

       
        res.cookie('token', token, { httpOnly: true });
        res.json({ success: true, redirect: '/dashboard' });
    });
});


app.get('/dashboard', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});


app.get('/api/dashboard', verifyToken, (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM patients', (err, rows) => {
        const totalPatients = rows[0].total;
        res.json({
            admin:         req.user.username,
            totalPatients: totalPatients
        });
    });
});


app.get('/api/patients', verifyToken, (req, res) => {
    db.query('SELECT * FROM patients ORDER BY id DESC', (err, rows) => {
        if (err) return res.json([]);
        res.json(rows);
    });
});

// Logout
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`🚀 MediTrack Week 4 running at http://localhost:${PORT}`);
});
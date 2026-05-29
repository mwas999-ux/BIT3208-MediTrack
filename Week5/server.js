
require('dotenv').config();
const express      = require('express');
const jwt          = require('jsonwebtoken');
const bcrypt       = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path         = require('path');
const db           = require('./db');
const verifyToken  = require('./middleware/auth');

const app  = express();
const PORT = process.env.PORT || 5002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Auth Routes ──────────────────────────────────
app.get('/',      (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, rows) => {
        if (err || rows.length === 0)
            return res.json({ success: false, message: 'Invalid credentials' });
        const match = await bcrypt.compare(password, rows[0].password);
        if (!match)
            return res.json({ success: false, message: 'Invalid credentials' });
        const token = jwt.sign(
            { id: rows[0].id, username: rows[0].username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
        res.cookie('token', token, { httpOnly: true });
        res.json({ success: true, redirect: '/dashboard' });
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// ─── Pages ────────────────────────────────────────
app.get('/dashboard',    verifyToken, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/patients',     verifyToken, (req, res) => res.sendFile(path.join(__dirname, 'public', 'patients.html')));
app.get('/doctors',      verifyToken, (req, res) => res.sendFile(path.join(__dirname, 'public', 'doctors.html')));
app.get('/appointments', verifyToken, (req, res) => res.sendFile(path.join(__dirname, 'public', 'appointments.html')));

// ─── Dashboard API ────────────────────────────────
app.get('/api/dashboard', verifyToken, (req, res) => {
    db.query('SELECT COUNT(*) AS patients FROM patients', (err, p) => {
        db.query('SELECT COUNT(*) AS doctors FROM doctors', (err, d) => {
            db.query('SELECT COUNT(*) AS appointments FROM appointments', (err, a) => {
                res.json({
                    admin:        req.user.username,
                    patients:     p[0].patients,
                    doctors:      d[0].doctors,
                    appointments: a[0].appointments
                });
            });
        });
    });
});

// ─── Patients CRUD ────────────────────────────────
app.get('/api/patients', verifyToken, (req, res) => {
    db.query('SELECT * FROM patients ORDER BY id DESC', (err, rows) => {
        if (err) return res.json([]);
        res.json(rows);
    });
});

app.post('/api/patients', verifyToken, (req, res) => {
    const { fullname, age, gender, phone, email } = req.body;
    db.query(
        'INSERT INTO patients (fullname, age, gender, phone, email) VALUES (?,?,?,?,?)',
        [fullname, age, gender, phone, email],
        (err) => {
            if (err) return res.json({ success: false, message: err.message });
            res.json({ success: true, message: 'Patient added successfully' });
        }
    );
});

app.put('/api/patients/:id', verifyToken, (req, res) => {
    const { fullname, age, gender, phone, email } = req.body;
    db.query(
        'UPDATE patients SET fullname=?, age=?, gender=?, phone=?, email=? WHERE id=?',
        [fullname, age, gender, phone, email, req.params.id],
        (err) => {
            if (err) return res.json({ success: false });
            res.json({ success: true, message: 'Patient updated successfully' });
        }
    );
});

app.delete('/api/patients/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM patients WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true, message: 'Patient deleted successfully' });
    });
});

// ─── Doctors CRUD ─────────────────────────────────
app.get('/api/doctors', verifyToken, (req, res) => {
    db.query('SELECT * FROM doctors ORDER BY id DESC', (err, rows) => {
        if (err) return res.json([]);
        res.json(rows);
    });
});

app.post('/api/doctors', verifyToken, (req, res) => {
    const { fullname, specialization, phone, email } = req.body;
    db.query(
        'INSERT INTO doctors (fullname, specialization, phone, email) VALUES (?,?,?,?)',
        [fullname, specialization, phone, email],
        (err) => {
            if (err) return res.json({ success: false, message: err.message });
            res.json({ success: true, message: 'Doctor added successfully' });
        }
    );
});

app.delete('/api/doctors/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM doctors WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true, message: 'Doctor deleted successfully' });
    });
});

// ─── Appointments CRUD ────────────────────────────
app.get('/api/appointments', verifyToken, (req, res) => {
    db.query(
        `SELECT a.*, p.fullname AS patient_name, d.fullname AS doctor_name 
         FROM appointments a 
         JOIN patients p ON a.patient_id = p.id 
         JOIN doctors d ON a.doctor_id = d.id 
         ORDER BY a.id DESC`,
        (err, rows) => {
            if (err) return res.json([]);
            res.json(rows);
        }
    );
});

app.post('/api/appointments', verifyToken, (req, res) => {
    const { patient_id, doctor_id, date, time, reason } = req.body;
    db.query(
        'INSERT INTO appointments (patient_id, doctor_id, date, time, reason) VALUES (?,?,?,?,?)',
        [patient_id, doctor_id, date, time, reason],
        (err) => {
            if (err) return res.json({ success: false, message: err.message });
            res.json({ success: true, message: 'Appointment booked successfully' });
        }
    );
});

app.delete('/api/appointments/:id', verifyToken, (req, res) => {
    db.query('DELETE FROM appointments WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true, message: 'Appointment deleted' });
    });
});

// ─── Get patients and doctors for dropdowns ───────
app.get('/api/patients-list', verifyToken, (req, res) => {
    db.query('SELECT id, fullname FROM patients', (err, rows) => {
        if (err) return res.json([]);
        res.json(rows);
    });
});

app.get('/api/doctors-list', verifyToken, (req, res) => {
    db.query('SELECT id, fullname FROM doctors', (err, rows) => {
        if (err) return res.json([]);
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`MediTrack Week 5 running at http://localhost:${PORT}`);
});
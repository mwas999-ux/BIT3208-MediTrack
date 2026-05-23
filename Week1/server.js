require('dotenv').config();
const express = require('express');
const db      = require('./db');
const app     = express();
const PORT    = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MediTrack — Week 1</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 80px auto; text-align: center; }
                h1   { color: #0077b6; }
                p    { color: #555; }
                .badge { display: inline-block; background: #0077b6; color: white; padding: 10px 24px; border-radius: 20px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h1> MediTrack</h1>
            <p>Clinic Management System</p>
            <p>BIT3208 — Advanced Web Design and Development</p>
            <div class="badge"> Server Running on Port ${PORT}</div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(` MediTrack server running at http://localhost:${PORT}`);
});
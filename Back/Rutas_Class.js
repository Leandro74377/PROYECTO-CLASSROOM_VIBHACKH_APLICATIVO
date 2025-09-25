import express from 'express';
import { createOAuthClient } from '../lib/googleClient.js';
import { google } from 'googleapis';


const router = express.Router();


// Middleware: ensure session
router.use((req, res, next) => {
if (!req.session?.user) return res.status(401).json({ error: 'not_authenticated' });
next();
});


// Example: list courses for the *current* user using refresh_token from DB
router.get('/courses', async (req, res) => {
try {
// TODO: fetch stored refresh_token for req.session.user.email from DB
const refreshToken = req.session.refresh_token;
if (!refreshToken) return res.status(400).json({ error: 'no_refresh_token' });


const oauth2Client = createOAuthClient();
oauth2Client.setCredentials({ refresh_token: refreshToken });


const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
const response = await classroom.courses.list({ pageSize: 200 });
res.json(response.data.courses || []);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'classroom_error' });
}
});


export default router;

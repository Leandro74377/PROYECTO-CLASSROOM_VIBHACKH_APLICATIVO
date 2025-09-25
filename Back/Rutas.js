import express from 'express';
import { createOAuthClient, CLASSROOM_SCOPES } from '../lib/googleClient.js';
import { google } from 'googleapis';


const router = express.Router();


router.get('/google', (req, res) => {
const oauth2Client = createOAuthClient();
const url = oauth2Client.generateAuthUrl({
access_type: 'offline',
scope: CLASSROOM_SCOPES,
prompt: 'consent'
});
res.redirect(url);
});


router.get('/google/callback', async (req, res) => {
try {
const oauth2Client = createOAuthClient();
const code = req.query.code;
const { tokens } = await oauth2Client.getToken(code);
oauth2Client.setCredentials(tokens);


// Get userinfo
const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
const me = await oauth2.userinfo.get();


// TODO: Upsert user in DB (store tokens.refresh_token if present)
// For demo we'll store in session
req.session.user = { email: me.data.email, name: me.data.name };


// Persist refresh token server-side in DB in production (encrypted)


res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
} catch (err) {
console.error(err);
res.status(500).send('Auth error');
}
});


export default router;

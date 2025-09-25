import express from 'express';
import { createOAuthClient, CLASSROOM_SCOPES } from './Libreria_goo.js';
import { google } from 'googleapis';

const router = express.Router();

// Ruta para iniciar autenticación con Google
router.get('/google', (req, res) => {
  try {
    const oauth2Client = createOAuthClient();
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: CLASSROOM_SCOPES,
      prompt: 'consent'
    });
    res.redirect(url);
  } catch (err) {
    console.error('Error generating Google Auth URL:', err);
    res.status(500).send('Error generating Google Auth URL');
  }
});

// Callback de Google OAuth
router.get('/google/callback', async (req, res) => {
  try {
    const oauth2Client = createOAuthClient();
    const code = req.query.code;

    if (!code) {
      return res.status(400).send('No auth code provided');
    }

    // Obtener tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Obtener datos del usuario
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const me = await oauth2.userinfo.get();

    // Guardar usuario en sesión (ejemplo)
    req.session.user = { email: me.data.email, name: me.data.name };

    // ⚠️ IMPORTANTE: en producción deberías guardar refresh_token en DB encriptada

    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  } catch (err) {
    console.error('Error en callback de Google OAuth:', err);
    res.status(500).send('Auth error');
  }
});

export default router;

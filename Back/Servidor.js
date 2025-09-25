import express from 'express';
import session from 'cookie-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rutas from './Rutas.js';
import rutasClass from './Rutas_Class.js';

import { createOAuthClient, CLASSROOM_SCOPES } from './Libreria_goo.js';
import { google } from 'googleapis';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para JSON
app.use(express.json());

// Middleware de sesión
app.use(
  session({
    name: 'sess',
    keys: [process.env.SESSION_KEY || 'secret'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Rutas API
app.use('/api', rutas);
app.use('/api/classroom', rutasClass);

// --- LOGIN GOOGLE CLASSROOM ---
app.get('/auth/google', (req, res) => {
  try {
    const oauth2Client = createOAuthClient();
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: CLASSROOM_SCOPES,
      prompt: 'consent',
    });
    res.redirect(url);
  } catch (err) {
    console.error('Error generating Google Auth URL:', err);
    res.status(500).send('Error generating Google Auth URL');
  }
});

app.get('/auth/google/callback', async (req, res) => {
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

    // Guardar usuario y refresh_token en sesión
    req.session.user = { email: me.data.email, name: me.data.name };
    req.session.refresh_token = tokens.refresh_token;

    // Redirigir al frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  } catch (err) {
    console.error('Error en callback de Google OAuth:', err);
    res.status(500).send('Auth error');
  }
});

// Servir frontend de React
const frontPath = path.join(__dirname, '../Front/dist');
app.use(express.static(frontPath));

// SPA: cualquier ruta no encontrada sirve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontPath, 'index.html'));
});

// Puerto
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

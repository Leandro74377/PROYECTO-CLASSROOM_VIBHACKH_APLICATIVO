import express from 'express';
import { google } from 'googleapis';
import { createOAuthClient, CLASSROOM_SCOPES } from './Libreria_goo.js';

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

    // Obtener estudiantes y profesores de la clase de prueba
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
    const courseId = 'ODA1NDI3NjA4NDgz'; // ID de tu clase de prueba

    // Obtener lista de estudiantes
    const students = await classroom.courses.students.list({
      courseId: courseId
    });

    // Obtener lista de profesores
    const teachers = await classroom.courses.teachers.list({
      courseId: courseId
    });

    // Mostrar estudiantes y profesores en consola
    console.log('Estudiantes:', students.data.students);
    console.log('Profesores:', teachers.data.teachers);

    // Redirigir al frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  } catch (err) {
    console.error('Error en callback de Google OAuth:', err);
    res.status(500).send('Auth error');
  }
});

export default router;

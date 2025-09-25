import express from 'express';
import { createOAuthClient } from './Libreria_goo.js';
import { google } from 'googleapis';

const router = express.Router();

// Middleware: verificar sesión activa
router.use((req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'not_authenticated' });
  }
  next();
});

// Listar cursos de Google Classroom para el usuario autenticado
router.get('/courses', async (req, res) => {
  try {
    // ⚠️ En producción deberías obtener refresh_token desde la BD según el usuario
    const refreshToken = req.session.refresh_token;

    if (!refreshToken) {
      return res.status(400).json({ error: 'no_refresh_token' });
    }

    // Configurar cliente OAuth con el refresh_token
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // Usar API de Classroom
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
    const response = await classroom.courses.list({ pageSize: 200 });

    res.json(response.data.courses || []);
  } catch (err) {
    console.error('Error al listar cursos de Classroom:', err);
    res.status(500).json({ error: 'classroom_error' });
  }
});

export default router;

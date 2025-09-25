import express from 'express';
import session from 'cookie-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rutas from './Rutas.js';
import rutasClass from './Rutas_Class.js';

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

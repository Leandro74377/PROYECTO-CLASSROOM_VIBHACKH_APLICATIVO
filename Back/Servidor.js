import express from 'express';
import session from 'cookie-session';
import dotenv from 'dotenv';
import rutas from './Rutas.js';
import rutasClass from './Rutas_Class.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(
  session({
    name: 'sess',
    keys: [process.env.SESSION_KEY || 'secret'],
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  })
);

// Rutas del backend
app.use('/api/rutas', rutas);
app.use('/api/class', rutasClass);

app.get('/api/me', (req, res) => {
  res.json(req.session.user || null);
});

// Servir frontend React compilado
app.use(express.static(path.join(__dirname, '../Front/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Front/build/index.html'));
});

// Puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

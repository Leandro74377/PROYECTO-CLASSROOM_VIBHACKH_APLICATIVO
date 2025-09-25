import express from 'express';
import session from 'cookie-session';
import dotenv from 'dotenv';
import path from 'path';
import rutas from './Rutas.js';
import rutasClass from './Rutas_Class.js';

dotenv.config();

const __dirname = path.resolve();
const app = express();

// Middlewares
app.use(express.json());
app.use(
  session({
    name: 'sess',
    keys: [process.env.SESSION_KEY || 'secret'],
    maxAge: 24 * 60 * 60 * 1000
  })
);

// Tus rutas API
app.use('/api', rutas);
app.use('/api/classroom', rutasClass);

// Servir React desde Front/dist (ajustado a la estructura de carpetas)
app.use(express.static(path.join(__dirname, '..', 'Front', 'dist')));

// Cualquier otra ruta devuelve index.html (para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Front', 'dist', 'index.html'));
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
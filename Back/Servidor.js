import express from 'express';
import session from 'cookie-session';
import dotenv from 'dotenv';
import path from 'path';
import Rutas from './Rutas.js';
import Rutas_Class from './Rutas_Class.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(
  session({
    name: 'sess',
    keys: [process.env.SESSION_KEY || 'secret'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// API routes
app.use('/api', Rutas);
app.use('/api/classroom', Rutas_Class);

// Servir React (Vite build)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'Front/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Front/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
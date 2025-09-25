import express from 'express';
import session from 'cookie-session';
import dotenv from 'dotenv';

// Importamos tus archivos reales
import rutas from './Rutas.js';
import rutasClass from './Rutas_Class.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  session({
    name: 'sess',
    keys: [process.env.SESSION_KEY || 'secret'],
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  })
);

// Montamos tus rutas
app.use('/api/rutas', rutas);
app.use('/api/class', rutasClass);

// Endpoint para revisar sesión
app.get('/api/me', (req, res) => {
  res.json(req.session.user || null);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

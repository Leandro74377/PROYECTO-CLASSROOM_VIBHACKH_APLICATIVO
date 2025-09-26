import express from 'express';
import cors from 'cors';
import coursesRouter from './routes/courses';
import overviewRouter from './routes/overview';

const app = express();
const PORT = process.env.PORT || 4000;

// CORS abierto
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/courses', coursesRouter);
app.use('/api/overview', overviewRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'Classroom Mock Backend running.' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

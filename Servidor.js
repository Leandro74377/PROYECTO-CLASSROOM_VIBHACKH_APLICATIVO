import express from 'express';
import session from 'cookie-session';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import classroomRoutes from './routes/classroom.js';


dotenv.config();
const app = express();


app.use(express.json());
app.use(
session({
name: 'sess',
keys: [process.env.SESSION_KEY || 'secret'],
maxAge: 24 * 60 * 60 * 1000
})
);


app.use('/auth', authRoutes);
app.use('/api/classroom', classroomRoutes);


app.get('/api/me', (req, res) => {
res.json(req.session.user || null);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

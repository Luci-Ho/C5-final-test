import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import teacherRoutes from './routes/teacher.routes.js';
import teacherPositionRoutes from './routes/position.routes.js';
import userRoutes from './routes/user.routes.js'
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/teacher-positions', teacherPositionRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'API not found'
  });
});

app.get('/', (req, res) => {
  res.send('Teacher Management System Backend is running');
});

export default app;
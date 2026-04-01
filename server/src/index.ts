import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import todoRoutes from './routes/todo';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: [
    FRONTEND_URL,
    'http://localhost:5173',
    /^https:\/\/.*\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/todos', todoRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

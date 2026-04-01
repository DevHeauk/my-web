import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req: AuthRequest, res: Response) => {
  const { email, name, password } = req.body;

  if (!email?.trim() || !name?.trim() || !password) {
    res.status(400).json({ message: '모든 필드를 입력해주세요' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: '비밀번호는 6자 이상이어야 합니다' });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email: email.trim() } });
  if (existing) {
    res.status(409).json({ message: '이미 사용 중인 이메일입니다' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email: email.trim(), name: name.trim(), password: hash },
  });

  const token = signToken(user.id);
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

router.post('/login', async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim() } });
  if (!user) {
    res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
    return;
  }

  const token = signToken(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    return;
  }

  res.json(user);
});

export default router;

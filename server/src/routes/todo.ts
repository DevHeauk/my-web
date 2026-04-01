import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(todos);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { title, dueTime, repeatDays } = req.body;

  if (!title?.trim()) {
    res.status(400).json({ message: '제목을 입력해주세요' });
    return;
  }

  const todo = await prisma.todo.create({
    data: {
      title: title.trim(),
      dueTime: dueTime ? new Date(dueTime) : null,
      repeatDays: repeatDays || [],
      userId: req.userId!,
    },
  });
  res.status(201).json(todo);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { title, completed, dueTime, repeatDays } = req.body;

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title.trim();
  if (completed !== undefined) {
    data.completed = completed;
    data.completedAt = completed ? new Date() : null;
  }
  if (dueTime !== undefined) data.dueTime = dueTime ? new Date(dueTime) : null;
  if (repeatDays !== undefined) data.repeatDays = repeatDays;

  try {
    const todo = await prisma.todo.update({
      where: { id, userId: req.userId },
      data,
    });
    res.json(todo);
  } catch {
    res.status(404).json({ message: '할 일을 찾을 수 없습니다' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  try {
    await prisma.todo.delete({ where: { id, userId: req.userId } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: '할 일을 찾을 수 없습니다' });
  }
});

export default router;

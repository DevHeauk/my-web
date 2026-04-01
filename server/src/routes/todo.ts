import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(todos);
});

router.post('/', async (req: Request, res: Response) => {
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
    },
  });
  res.status(201).json(todo);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
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
    const todo = await prisma.todo.update({ where: { id }, data });
    res.json(todo);
  } catch {
    res.status(404).json({ message: '할 일을 찾을 수 없습니다' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: '할 일을 찾을 수 없습니다' });
  }
});

export default router;

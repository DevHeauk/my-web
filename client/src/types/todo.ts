export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
  dueTime: string | null;
  repeatDays: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  dueTime?: string;
  repeatDays?: number[];
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  dueTime?: string | null;
  repeatDays?: number[];
}

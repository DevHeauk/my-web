import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import type { AuthResponse, LoginInput, RegisterInput, User } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(fn: () => void) {
  onUnauthorized = fn;
}

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    headers,
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    onUnauthorized?.();
    throw new Error('인증이 만료되었습니다');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  login: (data: LoginInput) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterInput) =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () =>
    request<User>('/api/auth/me'),

  getTodos: () =>
    request<Todo[]>('/api/todos'),

  createTodo: (data: CreateTodoInput) =>
    request<Todo>('/api/todos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTodo: (id: string, data: UpdateTodoInput) =>
    request<Todo>(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteTodo: (id: string) =>
    request<void>(`/api/todos/${id}`, {
      method: 'DELETE',
    }),
};

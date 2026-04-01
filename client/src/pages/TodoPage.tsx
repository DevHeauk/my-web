import { useState, useEffect, useCallback } from 'react';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import { api } from '../utils/api';
import TodoForm from '../components/todo/TodoForm';
import TodoItem from '../components/todo/TodoItem';
import styles from './TodoPage.module.css';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreate = async (input: CreateTodoInput) => {
    const todo = await api.createTodo(input);
    setTodos(prev => [todo, ...prev]);
  };

  const handleUpdate = useCallback(async (id: string, input: UpdateTodoInput) => {
    const updated = await api.updateTodo(id, input);
    setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await api.deleteTodo(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>할 일 목록</h1>

      <TodoForm onCreate={handleCreate} />

      {loading && <p className={styles.status}>불러오는 중...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && activeTodos.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            진행 중
            <span className={styles.count}>{activeTodos.length}</span>
          </h2>
          <div className={styles.list}>
            {activeTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && completedTodos.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            완료
            <span className={styles.count}>{completedTodos.length}</span>
          </h2>
          <div className={styles.list}>
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && todos.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>아직 할 일이 없습니다</p>
          <p className={styles.emptyDesc}>
            위의 입력란에 새로운 할 일을 추가해보세요
          </p>
        </div>
      )}
    </div>
  );
}

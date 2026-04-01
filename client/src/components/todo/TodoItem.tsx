import { useCallback } from 'react';
import type { Todo, UpdateTodoInput } from '../../types/todo';
import { useTimer } from '../../hooks/useTimer';
import RepeatDayPicker from './RepeatDayPicker';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, data: UpdateTodoInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const handleExpire = useCallback(() => {
    if (!todo.completed) {
      onUpdate(todo.id, { completed: true });
    }
  }, [todo.id, todo.completed, onUpdate]);

  const timer = useTimer(
    !todo.completed && todo.dueTime ? todo.dueTime : null,
    handleExpire,
  );

  const handleToggle = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const showTimer = todo.dueTime && !todo.completed;
  const hasRepeat = todo.repeatDays.length > 0;

  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <div className={styles.topRow}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={`${todo.title} 완료 여부`}
        />

        <span className={styles.title}>{todo.title}</span>

        <div className={styles.actions}>
          {showTimer && (
            <span className={`${styles.timer} ${timer.isExpired ? styles.timerExpired : ''}`}>
              {timer.isExpired
                ? '만료'
                : `${pad(timer.hours)}:${pad(timer.minutes)}:${pad(timer.seconds)}`
              }
            </span>
          )}

          {todo.completed && todo.dueTime && (
            <span className={styles.doneLabel}>완료</span>
          )}

          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label={`${todo.title} 삭제`}
          >
            삭제
          </button>
        </div>
      </div>

      {hasRepeat && (
        <div className={styles.bottomRow}>
          <RepeatDayPicker
            selected={todo.repeatDays}
            onChange={() => {}}
            readonly
          />
        </div>
      )}
    </div>
  );
}

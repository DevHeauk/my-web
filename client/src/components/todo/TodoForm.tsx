import { useState, type FormEvent } from 'react';
import type { CreateTodoInput } from '../../types/todo';
import RepeatDayPicker from './RepeatDayPicker';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  onCreate: (input: CreateTodoInput) => Promise<void>;
}

export default function TodoForm({ onCreate }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [dueTime, setDueTime] = useState('');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        dueTime: dueTime || undefined,
        repeatDays: repeatDays.length > 0 ? repeatDays : undefined,
      });
      setTitle('');
      setDueTime('');
      setRepeatDays([]);
      setShowOptions(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="할 일을 입력하세요..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!title.trim() || submitting}
        >
          추가
        </button>
      </div>

      <button
        type="button"
        className={styles.optionsToggle}
        onClick={() => setShowOptions(!showOptions)}
      >
        {showOptions ? '옵션 숨기기' : '옵션 보기'}
      </button>

      <div className={`${styles.optionsWrapper} ${showOptions ? styles.open : ''}`}>
        <div className={styles.optionsInner}>
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel} htmlFor="dueTime">
              완료 시간
            </label>
            <input
              id="dueTime"
              type="datetime-local"
              className={styles.dateInput}
              value={dueTime}
              onChange={e => setDueTime(e.target.value)}
            />
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>반복 요일</label>
            <RepeatDayPicker selected={repeatDays} onChange={setRepeatDays} />
          </div>
        </div>
      </div>
    </form>
  );
}

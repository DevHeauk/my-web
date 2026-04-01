import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      if (isRegister) {
        await register({ email, name, password });
      } else {
        await login({ email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>My Web</h1>
        <p className={styles.subtitle}>
          {isRegister ? '새 계정을 만들어보세요' : '로그인하여 시작하세요'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={submitting}
            />
          </div>

          {isRegister && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">이름</label>
              <input
                id="name"
                type="text"
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
                disabled={submitting}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isRegister ? '6자 이상 입력하세요' : '비밀번호를 입력하세요'}
              required
              minLength={isRegister ? 6 : undefined}
              disabled={submitting}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting
              ? (isRegister ? '가입 중...' : '로그인 중...')
              : (isRegister ? '회원가입' : '로그인')
            }
          </button>
        </form>

        <p className={styles.toggle}>
          {isRegister ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
          <button
            type="button"
            className={styles.toggleButton}
            onClick={toggleMode}
          >
            {isRegister ? '로그인' : '회원가입'}
          </button>
        </p>
      </div>
    </div>
  );
}

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo}>
          My Web
        </NavLink>

        <div className={styles.right}>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              할 일
            </NavLink>
          </nav>

          {user && (
            <div className={styles.userSection}>
              <span className={styles.userName}>{user.name}</span>
              <button className={styles.logoutButton} onClick={logout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

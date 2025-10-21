import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { toggleTheme } from "../../store/themeSlice";
import LoginForm from "../LoginForm/LoginForm";
import LogoutForm from "../LogoutForm/LogoutForm";
import styles from "./HeaderActions.module.scss";

export default function HeaderActions() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const { status } = useSelector((state: RootState) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  // Ссылка на DOM-элемент меню (нужна, чтобы отлавливать клики вне него)
  const menuRef = useRef<HTMLDivElement>(null);

  // Эффект, который следит за кликами вне меню
  useEffect(() => {
    // Функция-обработчик кликов по документу
    const handleClickOutside = (event: MouseEvent) => {
      // Если клик произошёл вне области меню — закрываем его
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Если меню открыто — подписываемся на событие клика по документу
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Если меню закрыто — убираем слушатель (чтобы не было утечки)
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Очистка при размонтировании или смене состояния
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]); // Эффект зависит от состояния menuOpen

  return (
    <div className={styles.actions} ref={menuRef}>
      <button
        className={styles.buttonLogin}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaUserCircle />
        {status}
      </button>
      <button
        className={styles.buttonTheme}
        onClick={() => dispatch(toggleTheme())}
      >
        {theme === "light" ? "☀️" : "🌙"}
      </button>
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          {status ? (
            <LogoutForm onClose={() => setMenuOpen(false)}/>
          ) : (
            <LoginForm onClose={() => setMenuOpen(false)} />
          )}
        </div>
      )}
    </div>
  );
}

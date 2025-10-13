import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { toggleTheme } from "../../store/themeSlice";
import LoginForm from "../LoginForm/LoginForm";
import styles from "./Header.module.scss";

const Header = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles.title}>The Wassermans</h1>
        <p className={styles.subtitle}>Расписание игр</p>
        <div className={styles.actions}>
          <button
            className={styles.buttonLogin}
            onClick={() => console.log("login")}
          >
            <FaUserCircle />
          </button>
          <button
            className={styles.buttonTheme}
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? "☀️" : "🌙"}
          </button>
          <div className={styles.dropdownMenu}>
            <LoginForm />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

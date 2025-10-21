import HeaderActions from "../HeaderActions/HeaderActions";
import styles from "./Header.module.scss";

const Header = () => {
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

import HeaderActions from "../HeaderActions/HeaderActions";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles.title}>The Wassermans</h1>
        <p className={styles.subtitle}>Расписание игр</p>
        <HeaderActions />
      </div>
    </header>
  );
};

export default Header;

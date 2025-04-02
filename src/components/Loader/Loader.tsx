import { useSelector } from "react-redux";
import { RootState } from "../../store";

import styles from "./Loader.module.scss"

const Loader = () => {
  const { theme } = useSelector((state: RootState) => state.board);

  return (
    <div className={`${styles.loader} ${theme === "dark" ? "dark" : "light"}`}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
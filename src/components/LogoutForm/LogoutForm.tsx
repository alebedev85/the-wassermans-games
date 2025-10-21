import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

import styles from "./LogoutForm.module.scss";

export default function LogoutForm() {
  const dispatch = useDispatch();
  return (
    <div className={styles.logout}>
      <button
        onClick={() => {
          dispatch(logout());
        }}
      >
        Выход
      </button>
    </div>
  );
}

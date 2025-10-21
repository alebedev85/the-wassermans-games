import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

import { auth } from "../../firebase";
import styles from "./LogoutForm.module.scss";

interface LogoutFormProps {
  onClose: () => void;
}

export default function LogoutForm({ onClose }: LogoutFormProps) {
  const dispatch = useDispatch();

  // Полный разлогин
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Разлогиниваем пользователя в Firebase
      dispatch(logout()); // Очищаем Redux store
      onClose(); // Закрываем меню
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  return (
    <div className={styles.logout}>
      <button onClick={handleLogout}>Выход</button>
    </div>
  );
}

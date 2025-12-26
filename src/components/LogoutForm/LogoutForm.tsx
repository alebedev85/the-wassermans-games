import { useAppDispatch } from "../../store";
import { LogoutUser } from "../../store/authSlice";

import styles from "./LogoutForm.module.scss";

interface LogoutFormProps {
  onClose: () => void;
}

export default function LogoutForm({ onClose }: LogoutFormProps) {
  const dispatch = useAppDispatch();

  // Полный разлогин
  const handleLogout = async () => {
    const result = await dispatch(LogoutUser());
        if (LogoutUser.fulfilled.match(result)) {
          onClose();
        } 
  };

  return (
    <div className={styles.logout}>
      <button onClick={handleLogout}>Выход</button>
    </div>
  );
}

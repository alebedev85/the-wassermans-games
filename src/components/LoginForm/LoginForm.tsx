import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { LoginUser } from "../../store/authSlice";
import Loader from "../Loader/Loader";
import styles from "./LoginForm.module.scss";

interface FormData {
  email: string;
  password: string;
}

interface AuthLoginForm {
  onClose: () => void;
}

export default function LoginForm({ onClose }: AuthLoginForm) {
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();

  const dispatch = useAppDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async ({ email, password }: FormData) => {
    const result = await dispatch(LoginUser({ email, password }));
    if (LoginUser.fulfilled.match(result)) {
      onClose();
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <form
      // autoComplete="off"
      className={styles.loginForm}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.inputs}>
        <input
          id="email"
          type="email"
          placeholder="Почта"
          {...register("email", {
            required: "Email обязателен",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Введите корректный email",
            },
          })}
        />
        <input
          id="password"
          type="password"
          placeholder="Пароль"
          {...register("password", {
            required: "Пароль обязателен",
            minLength: {
              value: 6,
              message: "Пароль должен содержать минимум 6 символа",
            },
          })}
        />
        {error && <p className={styles.error}>Ошибка: {error}</p>}
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <button className={styles.button}>Войти</button>
      )}
    </form>
  );
}

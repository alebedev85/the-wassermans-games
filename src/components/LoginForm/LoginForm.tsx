import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { loginFailure, loginStart, loginSuccess } from "../../store/authSlice";
import { login as firebaseLogin } from "../../utils/authService";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async ({ email, password }: FormData) => {
    dispatch(loginStart());
    try {
      const user = await firebaseLogin(email, password);
      dispatch(
        loginSuccess({
          email: user.email,
          id: user.uid,
          token: await user.getIdToken(),
        })
      );
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
      dispatch(loginFailure());
    }
  };

  return (
    <form
      autoComplete="off"
      className={styles.loginForm}
      onSubmit={handleSubmit(onSubmit)}
    >
      {isLoading ? (
        <Loader />
      ) : (
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
      )}

      <button className={styles.button}>Войти</button>
    </form>
  );
}

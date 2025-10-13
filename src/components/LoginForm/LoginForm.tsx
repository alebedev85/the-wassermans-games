import styles from "./LoginForm.module.scss";

export default function LoginForm() {
  return (
    <form className={styles.loginForm} onSubmit={() => console.log()}>
      <input type="text" name="login" placeholder="Логин"/>
      <input type="text" name="password" placeholder="Пароль"/>
      <button className={styles.button}>Войти</button>
    </form>
  );
}

import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <a
          href="https://a-lebedev-profile.vercel.app"
          target="_blank"
          rel="noreferrer noopener"
          aria-label={"My personal site"}
          title="My personal site"
        >
          © {new Date().getFullYear()} Андрей Лебедев. Все права защищены
        </a>
      </div>
    </footer>
  );
}

import classNames from "classnames";
import { FaTelegramPlane } from "react-icons/fa";
import Spotti from "../../../assets/spotti.svg"
import styles from "./LinkArea.module.scss";

interface LinkBlockProps {
  link: string;
  onChange: (value: string) => void;
  linkError: string;
  isEditMode: boolean;
}

export default function LinkArea({
  link,
  onChange,
  linkError,
  isEditMode,
}: LinkBlockProps) {

  return (
    <div className={styles.linkArea}>
      {link ? (
        <div className={styles.linkBlock}>
          <FaTelegramPlane style={{ color: "#3b97fa" }} />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onClick={(e) => e.stopPropagation()}
          >
            Запись на игру
          </a>
        </div>
      ) : (
        <div className={styles.linkBlock}>
          <img className={styles.spotti} src={Spotti} alt='' />
          <p>Пока нет ссылки на запись</p>
        </div>
      )}
      {isEditMode && (
        <div className={styles.linkInputBlock}>
          <input
            id="location"
            className={classNames(styles.input, styles.linkInput)}
            type="text"
            value={link}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ссылка в ТГ"
          />
          {linkError && <span className={styles.error}>{linkError}</span>}
        </div>
      )}
    </div>
  );
}

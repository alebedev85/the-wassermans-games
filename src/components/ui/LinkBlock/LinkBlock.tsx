import classNames from "classnames";
import { FaEdit } from "react-icons/fa";
import styles from "./LinkBlock.module.scss";

interface LinkBlockProps {
  link: string;
  onChange: (value: string) => void;
  linkError: string;
  isEditLink: boolean;
  setIsEditLink: (value: boolean) => void;
}

export default function LinkBlock({
  link,
  onChange,
  linkError,
  isEditLink,
  setIsEditLink,
}: LinkBlockProps) {

  const handelEditLink = () => {
    setIsEditLink(!isEditLink);
  };

  return (
    <div className={styles.linkBlock}>
      {link ? (
        <div style={{ width: "100%" }}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onClick={(e) => e.stopPropagation()}
          >
            Запись на игру
          </a>
          <button
            className={classNames(styles.editLinkButton, "tooltip")}
            data-tooltip="Редактировать ссылку"
            onClick={handelEditLink}
          >
            <FaEdit />
          </button>
        </div>
      ) : (
        <button className={styles.customFileUpload} onClick={handelEditLink}>
          Добавить ссылку в ТГ
        </button>
      )}
      {isEditLink && (
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

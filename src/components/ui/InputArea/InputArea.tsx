import classNames from "classnames";
import styles from "./InputArea.module.scss";

interface InputAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  isTitle?: boolean;
}

export default function InputArea({
  label,
  value,
  onChange,
  isTitle = false,
}: InputAreaProps) {
  return (
    <div className={styles.inputWrapper}>
      {!isTitle && (
        <label htmlFor="price" className={styles.label}>
          {`${label}:`}
        </label>
      )}
      <input
        className={classNames(styles.input, isTitle ? styles.titleInput : "")}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // disabled
      />
    </div>
  );
}

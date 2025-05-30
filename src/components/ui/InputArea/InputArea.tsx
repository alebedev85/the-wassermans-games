import classNames from "classnames";
import styles from "./InputArea.module.scss";

interface InputAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  isTitle?: boolean;
  isEditMode: boolean;
}

export default function InputArea({
  label,
  value,
  onChange,
  isTitle = false,
  isEditMode,
}: InputAreaProps) {
  return (
    <div className={styles.inputWrapper}>
      {!isTitle && (
        <label htmlFor="price" className={styles.label}>
          {`${label}:`}
        </label>
      )}
      <input
        className={classNames(styles.input, isTitle ? styles.title : "")}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditMode}
      />
    </div>
  );
}

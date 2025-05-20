import classNames from "classnames";
import styles from "./InputAria.module.scss";

interface InputAriaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function InputAria({label, value, onChange}: InputAriaProps) {
  return (
    <div className={styles.inputWrapper}>
      <label htmlFor="price" className={styles.label}>
        {label}:
      </label>
      <input
        id="time"
        className={classNames(styles.input)}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

import classNames from "classnames";
import styles from "./TaskModalControls.module.scss";

interface TaskModalControlsProps {
  disabled: boolean;
  handleSave: () => void;
  handleCancel: () => void;
}
export default function TaskModalControls({
  disabled,
  handleSave,
  handleCancel,
}: TaskModalControlsProps) {
  return (
    <div className={styles.controls}>
      <button
        className={classNames(styles.saveButton, {
          [styles.disabled]: disabled,
        })}
        onClick={handleSave}
        disabled={disabled} // Дизейблим кнопку при отсутствии изменений
      >
        Редактировать
      </button>
      <button
        className={classNames(styles.cancelButton, {
          [styles.disabled]: disabled,
        })}
        onClick={handleCancel}
        disabled={disabled}
      >
        Отмена
      </button>
    </div>
  );
}

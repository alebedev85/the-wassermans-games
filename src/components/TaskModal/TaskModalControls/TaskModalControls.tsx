import classNames from "classnames";
import styles from "./TaskModalControls.module.scss";

interface TaskModalControlsProps {
  disabled: boolean;
  handleSave: () => void;
  handleCancel: () => void;
  isEditMode: boolean;
  setIsEditMode: () => void;
}
export default function TaskModalControls({
  disabled,
  handleSave,
  handleCancel,
  isEditMode,
  setIsEditMode,
}: TaskModalControlsProps) {
  return (
    <div className={styles.controls}>
      {!isEditMode ? (
        <button className={classNames("buttonColorsPrimary", "squareButton")} onClick={setIsEditMode}>
          Редактировать
        </button>
      ) : (
        <>
          <button
            className={classNames("buttonColorsPrimary", "squareButton", {
              [styles.disabled]: disabled,
            })}
            onClick={handleSave}
            disabled={disabled} // Дизейблим кнопку при отсутствии изменений
          >
            Сохранить
          </button>
          <button
            className={classNames("buttonColorsSecondary", "squareButton")}
            onClick={handleCancel}
          >
            Отмена
          </button>
        </>
      )}
    </div>
  );
}

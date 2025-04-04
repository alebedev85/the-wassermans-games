import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { deleteTask, editTask } from "../../store/calendarSlice";
import { closeTaskModal } from "../../store/taskModalSlice";
import { Task } from "../../types";
import styles from "./TaskModal.module.scss";

const TaskModal = () => {
  const dispatch = useDispatch();
  const { isOpen, task } = useSelector((state: RootState) => state.taskModal);

  // Устанавливаем начальные значения для title и description
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  // Используем useEffect, чтобы обновить состояние при изменении task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  // Проверка: изменились ли данные
  const isChanged =
    task && (title !== task.title || description !== task.description);

  if (!isOpen || !task) return null;

  // Сохранить изменения
  const handleSave = () => {
    if (isChanged) {
      const updatedTask: Task = { ...task, title, description };
      dispatch(editTask(updatedTask));
    }
  };

  // Удалить задачу
  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    dispatch(closeTaskModal());
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => dispatch(closeTaskModal())}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия (крестик) */}
        <button
          className={styles.closeButton}
          onClick={() => dispatch(closeTaskModal())}
        >
          ✖
        </button>

        {/* Заголовок редактируется при клике */}
        <input
          className={classNames(styles.input, styles.titleInput)}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Описание редактируется при клике */}
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={styles.controls}>
          <button
            className={classNames(styles.saveButton, {
              [styles.disabled]: !isChanged,
            })}
            onClick={handleSave}
            disabled={!isChanged} // Дизейблим кнопку при отсутствии изменений
          >
            Сохранить
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

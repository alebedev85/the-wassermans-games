import { useAppDispatch, useAppSelector } from "../../store";
import { deleteTask } from "../../store/calendarSlice";
import { closeDeleteModal } from "../../store/deleteTaskModalSlice";
import styles from "./DeleteTaskModal.module.scss";

const DeleteTaskModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, task } = useAppSelector((state) => state.deleteTaskModal);

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    dispatch(deleteTask(task.id));
    dispatch(closeDeleteModal());
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => dispatch(closeDeleteModal())}
    >
      <div className={styles.modalContent}>
        <h3>Удалить задачу?</h3>
        <p>
          Вы уверены, что хотите удалить эту задачу? Это действие нельзя
          отменить.
        </p>
        <div className={styles.buttons}>
          <button
            className={styles.cancel}
            onClick={() => dispatch(closeDeleteModal())}
          >
            Отмена
          </button>
          <button className={styles.confirm} onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;

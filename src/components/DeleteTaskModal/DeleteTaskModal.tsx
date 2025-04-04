import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { deleteTask } from "../../store/calendarSlice";
import { closeDeleteModal } from "../../store/deleteTaskModalSlice";
import styles from "./DeleteTaskModal.module.scss";
import { closeTaskModal } from "../../store/taskModalSlice";

const DeleteTaskModal = () => {
  const dispatch = useDispatch();
  const { isOpen, task } = useSelector(
    (state: RootState) => state.deleteTaskModal
  );

  if (!isOpen || !task) return null;

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    dispatch(closeDeleteModal());
    dispatch(closeTaskModal());
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

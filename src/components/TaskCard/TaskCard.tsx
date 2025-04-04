import { Draggable } from "@hello-pangea/dnd";
import { useDispatch } from "react-redux";
import { openTaskModal } from "../../store/taskModalSlice";
import { Task } from "../../types";
import { IoClose } from "react-icons/io5"; // Иконка крестика
import styles from "./TaskCard.module.scss";
import { deleteTask } from "../../store/calendarSlice";

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: TaskCardProps) => {
  const dispatch = useDispatch();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Чтобы не срабатывал клик на задачу
    dispatch(deleteTask(task.id));
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.taskCard} ${
            snapshot.isDragging ? styles.isDragging : ""
          }`}
          onClick={() => dispatch(openTaskModal(task))}
        >
          {/* Кнопка удаления */}
          <button className={styles.deleteButton} onClick={handleDelete}>
            <IoClose />
          </button>

          {/* Заголовок по центру */}
          <h3 className={styles.title}>{task.title}</h3>

          {/* Цена и место */}
          <div className={styles.details}>
            <p>
              <strong>Цена:</strong> {task.price} ₽
            </p>
            <p>
              <strong>Место:</strong> {task.location}
            </p>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default TaskCard;

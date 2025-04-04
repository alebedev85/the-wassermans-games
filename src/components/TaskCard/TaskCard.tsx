import { Draggable } from "@hello-pangea/dnd";
import { IoClose } from "react-icons/io5"; // Иконка крестика
import { useDispatch } from "react-redux";
import { openDeleteModal } from "../../store/deleteTaskModalSlice";
import { openTaskModal } from "../../store/taskModalSlice";
import { Task } from "../../types";
import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: TaskCardProps) => {
  const dispatch = useDispatch();

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
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(openDeleteModal(task));
            }}
          >
            <IoClose />
          </button>

          {/* Заголовок по центру */}
          <h3 className={styles.title}>{task.title}</h3>

          {/* Цена и место */}
          <div className={styles.details}>
            <p>
              Цена:{task.price} ₽
            </p>
            <p>
              Место:{task.location}
            </p>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default TaskCard;

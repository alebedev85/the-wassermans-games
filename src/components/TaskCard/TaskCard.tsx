import { Draggable } from "@hello-pangea/dnd";
import classNames from "classnames";
import { IoClose } from "react-icons/io5"; // Иконка крестика
import { useDispatch } from "react-redux";
import fallbackImage from "../../assets/artwork.png";
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
            className={classNames(styles.deleteButton, "tooltip")}
            data-tooltip="Удалить игру"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(openDeleteModal(task));
            }}
          >
            <IoClose />
          </button>

          {/* Заголовок по центру */}
          <h3 className={styles.title}>{task.title}</h3>

          {/* Изображение (если есть) */}

          <img
            src={task.imageUrl || fallbackImage}
            alt={task.title}
            className={styles.image}
            loading="lazy"
          />

          {/* Цена и место */}
          <div className={styles.details}>
            <p>Начало: {task.time}</p>
            <p>Цена: {task.price} ₽</p>
            <p>Место: {task.location}</p>
            {task.link && (
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Запись на игру
              </a>
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default TaskCard;

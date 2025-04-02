import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { Task } from "../../types";
import styles from "./TaskCard.module.scss";
import { openTaskModal } from "../../store/taskModalSlice";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useDispatch();
  // Настройки Drag & Drop
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  // Применение стилей для плавного перемещения
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.taskCard}
      onClick={() => dispatch(openTaskModal(task))}
    >
      <h3 className={styles.title}>{task.title}</h3>
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}
    </li>
  );
};

export default TaskCard;

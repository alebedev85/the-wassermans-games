import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../../types";
import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }:TaskCardProps) => {
  // Настройки Drag & Drop
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  // Применение стилей для плавного перемещения
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.taskCard}>
      <h3 className={styles.title}>{task.title}</h3>
      {task.description && <p className={styles.description}>{task.description}</p>}
    </li>
  );
};

export default TaskCard;

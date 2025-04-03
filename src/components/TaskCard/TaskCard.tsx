import { Draggable } from "@hello-pangea/dnd";
import { useDispatch } from "react-redux";
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
          <h3 className={styles.title}>{task.title}</h3>
          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}
        </li>
      )}
    </Draggable>
  );
};

export default TaskCard;

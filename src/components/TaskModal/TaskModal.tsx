import { useState } from "react";
import styles from "./TaskModal.module.scss";

type TaskModalProps = {
  day: string;
  onClose: () => void;
};

export const TaskModal = ({ day, onClose }: TaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = () => {
    console.log("Добавлена задача:", { title, description, day });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Добавить задачу на {day}</h2>
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddTask}>+</button>
      </div>
    </div>
  );
};

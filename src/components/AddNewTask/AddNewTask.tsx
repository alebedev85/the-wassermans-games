import cn from "classnames";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../../store/calendarSlice";
import { Task } from "../../types";
import styles from "./AddNewTask.module.scss";

interface TaskFormProps {
  selectedDate: Date;
}

const TaskForm = ({ selectedDate }: TaskFormProps) => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleSubmit = () => {
    if (taskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        description: taskDescription || "",
        date: selectedDate.toISOString(),
      };
      dispatch(addTask(newTask));
      setMenuOpen(!menuOpen); // Закрыть форму после добавления задачи
    }
  };

  return (
    <div className={styles.newTaskMenu} ref={menuRef}>
      <button
        className={styles.newTaskButton}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        +
      </button>
      <form className={cn(styles.dropdownMenu, menuOpen ? styles.open : "")}>
        <h3>Новая задача на {format(selectedDate, "dd MMMM yyyy")}</h3>
        <input
          type="text"
          placeholder="Название задачи"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Описание (необязательно)"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <div className={styles.controls}>
          <button className={styles.addButton} onClick={handleSubmit}>
            Добавить
          </button>
          <button
            className={styles.closeButton}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Закрыть
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

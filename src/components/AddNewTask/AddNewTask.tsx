import { useEffect, useRef, useState } from "react";
import TaskForm from "../TaskForm/TaskForm";
import styles from "./AddNewTask.module.scss";

interface AddNewTaskProps {
  selectedDate: Date;
}

const AddNewTask = ({ selectedDate }: AddNewTaskProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={styles.newTaskMenu} ref={menuRef}>
      <button
        className={(styles.newTaskButton)}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        +
      </button>
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          <TaskForm
            selectedDate={selectedDate}
            onClose={() => setMenuOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AddNewTask;

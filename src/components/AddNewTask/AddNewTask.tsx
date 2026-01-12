import { useEffect, useRef, useState } from "react";
import AddTaskForm from "../AddTaskForm/AddTaskForm";
import styles from "./AddNewTask.module.scss";

interface AddNewTaskProps {
  selectedDate: Date;
}


const AddNewTask = ({ selectedDate }: AddNewTaskProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Ссылка на DOM-элемент меню (нужна, чтобы отлавливать клики вне него)
  const menuRef = useRef<HTMLDivElement>(null);

  // Эффект, который следит за кликами вне меню
  useEffect(() => {
    // Функция-обработчик кликов по документу
    const handleClickOutside = (event: MouseEvent) => {
      // Если клик произошёл вне области меню — закрываем его
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Если меню открыто — подписываемся на событие клика по документу
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Если меню закрыто — убираем слушатель (чтобы не было утечки)
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Очистка при размонтировании или смене состояния
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]); // Эффект зависит от состояния menuOpen

  return (
    // Обертка для кнопки и выпадающего меню
    <div className={styles.newTaskMenu} ref={menuRef}>
      {/* Кнопка открытия / закрытия меню */}
      <button
        className={styles.newTaskButton}
        onClick={() => setMenuOpen(!menuOpen)} // Переключаем состояние
      >
        +
      </button>

      {/* Если меню открыто — рендерим компонент формы добавления задачи */}
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          <AddTaskForm
            selectedDate={selectedDate}       // Передаем выбранную дату
            onClose={() => setMenuOpen(false)} // Закрытие формы по действию изнутри
          />
        </div>
      )}
    </div>
  );
};


export default AddNewTask;

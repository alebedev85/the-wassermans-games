import {
  addDays,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ru } from "date-fns/locale";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "../../components/TaskCard/TaskCard"; // Импорт TaskCard
import { RootState } from "../../store";
import { addTask } from "../../store/calendarSlice";
import { Task } from "../../types";
import styles from "./Calendar.module.scss";

const Calendar: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.calendar.tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date(); // Текущая дата
  const monthStart = startOfMonth(today); // Первый день месяца
  const monthEnd = endOfMonth(today); // Последний день месяца

  // Генерация всех дней месяца в формате сетки
  const monthDays = [];
  let currentDay = startOfWeek(monthStart, { weekStartsOn: 1 });

  while (currentDay <= monthEnd) {
    monthDays.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }

  // Открытие модального окна при клике на день
  const handleSelectDay = (day: Date) => {
    setSelectedDate(day);
    setModalOpen(true);
  };

  // Добавление задачи
  const handleAddTask = () => {
    if (newTask.title.trim() && selectedDate) {
      const newTaskData: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description || "",
        date: selectedDate.toISOString(),
      };
      dispatch(addTask(newTaskData));
      setNewTask({ title: "", description: "" });
      setModalOpen(false);
    }
  };

  return (
    <div className={styles.calendar}>
      <h2>{format(today, "MMMM yyyy", { locale: ru })}</h2>

      <div className={styles.calendarGrid}>
        {monthDays.map((day, index) => (
          <div
            key={index}
            className={`${styles.calendarDay} ${
              isSameDay(day, today) ? styles.today : ""
            }`}
            onClick={() => handleSelectDay(day)}
          >
            <span className={styles.dayNumber}>{format(day, "d")}</span>
            <div className={styles.taskList}>
              {tasks
                .filter((task) => isSameDay(new Date(task.date), day))
                .map((task) => (
                  <TaskCard key={task.id} task={task} /> // Используем TaskCard
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно */}
      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Новая задача</h3>
            <input
              type="text"
              placeholder="Название"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Описание (необязательно)"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <button onClick={handleAddTask}>Добавить</button>
            <button onClick={() => setModalOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

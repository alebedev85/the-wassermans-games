import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ru } from "date-fns/locale";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AddNewTask from "../../components/AddNewTask/AddNewTask"; // Импортируем компонент формы
import TaskCard from "../../components/TaskCard/TaskCard";
import { RootState } from "../../store";
import styles from "./Calendar.module.scss";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]; // Названия дней недели

const Calendar: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.calendar.tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Генерация дней месяца в виде сетки
  const monthDays = [];
  let currentDay = startOfWeek(monthStart, { weekStartsOn: 1 });

  while (currentDay <= monthEnd) {
    monthDays.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }

  // Переключение на предыдущий месяц
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Переключение на следующий месяц
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Обработчик клика вне формы (закрытие формы)
  const modalRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    // Добавляем обработчик клика вне формы
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth}>{"<"}</button>
        <h2>{format(currentMonth, "MMMM yyyy", { locale: ru })}</h2>
        <button onClick={handleNextMonth}>{">"}</button>
      </div>

      {/* Заголовки дней недели */}
      <div className={styles.weekDays}>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`${styles.weekDay} ${index >= 5 ? styles.weekend : ""}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Сетка календаря */}
      <div className={styles.calendarGrid}>
        {monthDays.map((day, index) => (
          <div
            key={index}
            className={`${styles.calendarDay} ${
              isSameDay(day, today) ? styles.today : ""
            } ${
              getDay(day) === 6 || getDay(day) === 0 ? styles.weekendDay : ""
            }`}
          >
            <div className={styles.dayTitle}>
              <span className={styles.dayNumber}>{format(day, "d")}</span>
              {/* Кнопка для открытия формы */}
              <AddNewTask
                selectedDate={day}
              />
            </div>
            <div className={styles.taskList}>
              {tasks
                .filter((task) => isSameDay(new Date(task.date), day))
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Выпадающая форма для добавления задачи */}
      {/* {modalOpen && selectedDate && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} ref={modalRef}>
            <AddNewTask
              selectedDate={selectedDate}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Calendar;

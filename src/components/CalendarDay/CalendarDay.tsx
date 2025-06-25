import AddNewTask from "../../components/AddNewTask/AddNewTask";
import TaskCard from "../../components/TaskCard/TaskCard";
import { Task } from "../../types";
import { DroppableProvided } from "@hello-pangea/dnd";
import styles from "./CalendarDay.module.scss";

interface CalendarDayProps {
  day: Date;
  isWeekend: boolean;
  isToday: boolean;
  isPast: boolean;
  tasks: Task[];
  droppableProps?: Partial<DroppableProvided["droppableProps"]>; // DnD-пропсы
  innerRef?: (element: HTMLElement | null) => void;       // DnD-реф
  placeholder?: React.ReactNode;                          // DnD-заполнитель
}

/**
 * Компонент одного дня календаря.
 * Поддерживает Drop-зону для задач.
 */
const CalendarDay = ({
  day,
  isWeekend,
  isToday,
  isPast,
  tasks,
  droppableProps,
  innerRef,
  placeholder,
}: CalendarDayProps) => {
  return (
    <div
      className={`${styles.calendarDay} ${isToday ? styles.today : ""} ${
        isPast ? styles.pastDay : ""
      }`}
      ref={innerRef}           // DnD внутренняя ссылка
      {...droppableProps}      // DnD пропсы
    >
      <div className={styles.dayTitle}>
        <span
          className={`${styles.dayNumber} ${isWeekend ? styles.weekend : ""}`}
        >
          {day.getDate()}
        </span>
      </div>

      <AddNewTask selectedDate={day} />

      <ul className={styles.taskList}>
        {tasks
          .sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0))
          .map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
      </ul>

      {placeholder} {/* DnD placeholder обязателен для плавного перемещения */}
    </div>
  );
};

export default CalendarDay;

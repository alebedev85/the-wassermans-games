import { DroppableProvided } from "@hello-pangea/dnd";
import AddNewTask from "../../components/AddNewTask/AddNewTask";
import TaskCard from "../../components/TaskCard/TaskCard";
import { Task } from "../../types";
import styles from "./CalendarDay.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface CalendarDayProps {
  day: Date;
  isWeekend: boolean;
  isToday: boolean;
  isPast: boolean;
  tasks: Task[];
  droppableProps?: Partial<DroppableProvided["droppableProps"]>; // DnD-пропсы
  innerRef?: (element: HTMLElement | null) => void; // DnD-реф
  placeholder?: React.ReactNode; // DnD-заполнитель
}

/**
 * Компонент `CalendarDay`
 * Отображает отдельную ячейку календаря с задачами, датой и возможностью добавить новую задачу.
 * Поддерживает drag-and-drop (drop-зона).
 *
 * @param {Date} day - Дата, которую представляет эта ячейка календаря
 * @param {boolean} isWeekend - Флаг, указывающий, является ли день выходным (для стилизации)
 * @param {boolean} isToday - Флаг, указывающий, является ли день текущим (для подсветки)
 * @param {boolean} isPast - Флаг, указывающий, прошёл ли этот день (для затемнения)
 * @param {Task[]} tasks - Массив задач, относящихся к этой дате
 * @param {Partial<DroppableProvided["droppableProps"]>} [droppableProps] - Пропсы, предоставленные DnD-библиотекой (опционально)
 * @param {(element: HTMLElement | null) => void} [innerRef] - Ref, используемый DnD-библиотекой (опционально)
 * @param {React.ReactNode} [placeholder] - Placeholder от DnD-библиотеки для корректного рендера (опционально)
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
  const { status } = useSelector((state: RootState) => state.auth);
  
  return (
    <div
      className={`${styles.calendarDay} ${isToday ? styles.today : ""} ${
        isPast ? styles.pastDay : ""
      }`}
      ref={innerRef} // DnD: передаём ссылку, необходимую для корректной работы перетаскивания
      {...droppableProps} // DnD: прокидываем специальные пропсы от библиотеки dnd
    >
      {/* Заголовок дня с номером и пометкой выходного дня */}
      <div className={styles.dayTitle}>
        <span
          className={`${styles.dayNumber} ${isWeekend ? styles.weekend : ""}`}
        >
          {day.getDate()}
        </span>
      </div>

      {/* Кнопка/форма для добавления новой задачи */}
      {status && <AddNewTask selectedDate={day} />}

      {/* Список задач этого дня */}
      <ul className={styles.taskList}>
        {tasks
          .sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0)) // Сортировка по времени
          .map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} /> // Отображение каждой задачи
          ))}
      </ul>

      {/* DnD placeholder — нужен для корректной отрисовки при перетаскивании */}
      {placeholder}
    </div>
  );
};

export default CalendarDay;

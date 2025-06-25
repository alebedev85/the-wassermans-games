import { Droppable } from "@hello-pangea/dnd";
import { format, getDay, isPast, isSameDay } from "date-fns";
import { Task } from "../../types";
import CalendarDay from "../CalendarDay/CalendarDay";
import WeekDay from "../WeekDay/WeekDay";
import styles from "./CalendarGrid.module.scss";

// Типизация пропсов
interface CalendarGridProps {
  days: Date[]; // Массив дат для текущего месяца (включая дни начала/конца недели)
  today: Date; // Текущая дата для подсветки
  tasks: Task[]; // Задачи на месяц
}

/**
 * Компонент, рендерящий сетку календаря с днями недели и droppable ячейками.
 */
const CalendarGrid = ({ days, today, tasks }: CalendarGridProps) => {
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className={styles.calendarGrid}>
      {/* Отображение дней недели */}
      {weekDays.map((day, index) => (
        <WeekDay key={index} label={day} isWeekend={index >= 5} />
      ))}

      {/* Отображение ячеек календаря */}
      {days.map((day) => {
        const isWeekend = getDay(day) === 6 || getDay(day) === 0;
        const dayId = format(day, "yyyy-MM-dd");

        return (
          <Droppable droppableId={dayId} type="TASK" key={dayId}>
            {(provided) => (
              <CalendarDay
                day={day}
                isWeekend={isWeekend}
                isToday={isSameDay(day, today)}
                isPast={isPast(day)}
                tasks={tasks.filter((task) =>
                  isSameDay(new Date(task.date), day)
                )}
                placeholder={provided.placeholder}
                droppableProps={provided.droppableProps}
                innerRef={provided.innerRef}
              />
            )}
          </Droppable>
        );
      })}
    </div>
  );
};

export default CalendarGrid;

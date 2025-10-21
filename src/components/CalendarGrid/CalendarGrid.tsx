import { Droppable } from "@hello-pangea/dnd";
import { format, getDay, isPast, isSameDay } from "date-fns";
import { Task } from "../../types";
import CalendarDay from "../CalendarDay/CalendarDay";
import WeekDay from "../WeekDay/WeekDay";
import styles from "./CalendarGrid.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

// Типизация пропсов
interface CalendarGridProps {
  days: Date[]; // Массив дат для текущего месяца (включая дни начала/конца недели)
  today: Date; // Текущая дата для подсветки
  tasks: Task[]; // Задачи на месяц
}

/**
 * Компонент `CalendarGrid`
 * Отображает сетку календаря, включающую ячейки для каждого дня месяца.
 * Каждая ячейка — это зона Droppable для поддержки drag-and-drop задач.
 *
 * @param {Date[]} days - Массив всех отображаемых дней (включая дни из предыдущего/следующего месяца для полной недели)
 * @param {Date} today - Текущая дата. Используется для визуального выделения сегодняшнего дня
 * @param {Task[]} tasks - Список всех задач за месяц. Отфильтровываются и сортируются внутри ячеек по дате
 */
const CalendarGrid = ({ days, today, tasks }: CalendarGridProps) => {
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const { status } = useSelector((state: RootState) => state.auth);

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
          <Droppable droppableId={dayId} type="TASK" key={dayId} isDropDisabled={!status}>
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

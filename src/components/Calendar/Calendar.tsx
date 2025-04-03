import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd"; // Правильные импорты для DnD
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDay,
  isPast,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddNewTask from "../../components/AddNewTask/AddNewTask";
import TaskCard from "../../components/TaskCard/TaskCard";
import { RootState } from "../../store";
import { moveTask } from "../../store/calendarSlice"; // Импортируем действие
import styles from "./Calendar.module.scss";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const Calendar = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.calendar.tasks);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthDays = [];
  let currentDay = startOfWeek(monthStart, { weekStartsOn: 1 });

  while (currentDay <= monthEnd) {
    monthDays.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Обработчик завершения перетаскивания
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Если элемент перетаскивали, но не отпустили в допустимой зоне, выходим
    if (!destination) return;

    // Если элемент остался на том же месте, где был, выходим
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Диспатчим действие с правильным идентификатором задачи и новой датой
    dispatch(
      moveTask({ taskId: draggableId, newDate: destination.droppableId })
    );
  };

  return (
    <div className={styles.calendar}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.header}>
          <button onClick={handlePrevMonth}>{"<"}</button>
          <h2>{format(currentMonth, "LLLL yyyy", { locale: ru })}</h2>
          <button onClick={handleNextMonth}>{">"}</button>
        </div>

        <div className={styles.weekDays}>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`${styles.weekDay} ${
                index >= 5 ? styles.weekend : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          {monthDays.map((day, index) => {
            const isWeekend = getDay(day) === 6 || getDay(day) === 0;
            return (
              <Droppable key={index} droppableId={day.toISOString()}>
                {(provided) => (
                  // Оборачиваем JSX в функцию, передаваемую в Droppable
                  <div
                    ref={provided.innerRef} // Используем provided для innerRef
                    {...provided.droppableProps} // Применяем droppableProps
                    className={`${styles.calendarDay} ${
                      isSameDay(day, today) ? styles.today : ""
                    } ${isPast(day) ? styles.pastDay : ""}`}
                  >
                    <div className={styles.dayTitle}>
                      <span
                        className={`${styles.dayNumber} ${
                          isWeekend ? styles.weekend : ""
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                    </div>
                    <AddNewTask selectedDate={day} />
                    <ul className={styles.taskList}>
                      {tasks
                        .filter((task) => isSameDay(new Date(task.date), day))
                        .map((task, index) => (
                          <TaskCard task={task} index={index} />
                        ))}
                    </ul>
                    {provided.placeholder} {/* Placeholder для Droppable */}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Calendar;

import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd"; // Импортируем DnD-компоненты
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
} from "date-fns"; // Импортируем методы для работы с датами
import { ru } from "date-fns/locale"; // Локализация для русских названий месяцев
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Используем Redux
import AddNewTask from "../../components/AddNewTask/AddNewTask";
import TaskCard from "../../components/TaskCard/TaskCard";
import useSaveBoardState from "../../hooks/useSaveBoardState";
import { RootState } from "../../store";
import { moveTask, setTasks } from "../../store/calendarSlice"; // Действие Redux для перемещения задач
import { loadCalendar } from "../../utils/storageFirebase";
import Loader from "../Loader/Loader";
import styles from "./Calendar.module.scss";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const Calendar = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const tasks = useSelector((state: RootState) => state.calendar.tasks);
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Храним текущий месяц
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthDays = [];
  let currentDay = startOfWeek(monthStart, { weekStartsOn: 1 }); // Получаем начало недели (с понедельника)

  while (currentDay <= monthEnd) {
    monthDays.push(new Date(currentDay)); // Добавляем текущий день в массив
    currentDay = addDays(currentDay, 1); // Переход на следующий день
  }

  // Переключение месяца назад
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  // Переключение месяца вперед
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  /**
   * Функция обработки завершения перетаскивания
   * @param {DropResult} result - объект результата DnD
   */
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Если элемент не был "брошен" в допустимой зоне, ничего не делаем
    if (!destination) return;

    // Если элемент остался на том же месте, выходим
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Диспатчим Redux-экшен, перемещающий задачу в новый день
    dispatch(
      moveTask({ taskId: draggableId, newDate: destination.droppableId })
    );
  };

  // Загрузка данных календаря из Firebase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Начинаем загрузку
      const calendarData = await loadCalendar(); // Загружаем данные без userId
      if (calendarData) {
        dispatch(setTasks(calendarData.tasks)); // Записываем задачи в Redux
      }
      setIsLoading(false); // Завершаем загрузку
    };

    fetchData();
  }, [dispatch]);

  // Хук для сохранения состояния доски при изменении
  useSaveBoardState();

  return isLoading ? (
    <div className={styles.loader}>
      <Loader />
    </div>
  ) : (
    <div className={styles.calendar}>
      {/* DragDropContext обязателен, он оборачивает всю область с DnD */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Шапка календаря */}
        <div className={styles.header}>
          <button onClick={handlePrevMonth}>{"<"}</button>
          <h2>
            {format(currentMonth, "LLLL yyyy", { locale: ru }).replace(
              /^./,
              (s) => s.toUpperCase()
            )}
          </h2>
          <button onClick={handleNextMonth}>{">"}</button>
        </div>

        {/* Основная сетка календаря */}
        <div className={styles.calendarGrid}>
          {/* Отображение дней недели */}
          {weekDays.map((day, index) => (
            <div
              key={`label-${index}`}
              className={`${styles.weekDay} ${
                index >= 5 ? styles.weekend : ""
              }`}
            >
              {day}
            </div>
          ))}
          {monthDays.map((day, index) => {
            const isWeekend = getDay(day) === 6 || getDay(day) === 0;
            const dayId = format(day, "yyyy-MM-dd"); // Используем формат YYYY-MM-DD для ID
            return (
              <div
                key={index}
                className={`${styles.calendarDay} ${
                  isSameDay(day, today) ? styles.today : "" // Подсвечиваем текущий день
                } ${isPast(day) ? styles.pastDay : ""}`} // Подсвечиваем прошедшие дни
              >
                <div className={styles.dayTitle}>
                  <span
                    className={`${styles.dayNumber} ${
                      isWeekend ? styles.weekend : "" // Отмечаем выходные дни
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <AddNewTask selectedDate={day} />

                {/* Droppable для задач в конкретном дне */}
                <Droppable droppableId={dayId} type="TASK">
                  {(provided) => (
                    <ul
                      ref={provided.innerRef} // Передаем ref для Drag and Drop
                      {...provided.droppableProps} // Добавляем нужные свойства
                      className={styles.taskList}
                    >
                      {tasks
                        .filter((task) => isSameDay(new Date(task.date), day)) // Фильтруем задачи по дню
                        .sort((a, b) => {
                          // Сортировка по времени (возрастание)
                          if (a.time < b.time) return -1;
                          if (a.time > b.time) return 1;
                          return 0;
                        })
                        .map((task, index) => (
                          <TaskCard
                            key={task.id} // Обязательно добавляем key
                            task={task}
                            index={index} // Индекс для Drag and Drop
                          />
                        ))}
                      {provided.placeholder} {/* Placeholder нужен для DnD */}
                    </ul>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Calendar;

import { DragDropContext } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import CalendarGrid from "../../components/CalendarGrid/CalendarGrid";
import CalendarHeader from "../../components/CalendarHeader/CalendarHeader";
import Loader from "../../components/Loader/Loader";

import useCalendarDays from "../../hooks/useCalendarDays";
import useCurrentMonth from "../../hooks/useCurrentMonth";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import { useAppDispatch, useAppSelector } from "../../store";

import { useEffect, useState } from "react";
import { setTasks } from "../../store/calendarSlice";
import { getAllTasks } from "../../utils/storageFirebase";
import styles from "./Calendar.module.scss";

const Calendar = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  // Получаем список задач из Redux store
  const tasks = useAppSelector((state) => state.calendar.tasks);

  // Хук для текущего месяца и переключения месяцев
  const { currentMonth, handleNextMonth, handlePrevMonth } = useCurrentMonth();

  // Хук для обработки drag and drop
  const { handleDragEnd } = useDragAndDrop();

  // Получаем массив дней для текущего месяца
  const days = useCalendarDays(currentMonth);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true); // Начинаем загрузку
      try {
        const tasks = await getAllTasks();
        dispatch(setTasks(tasks));
      } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
        alert("Не удалось загрузить задачи. Попробуйте обновить страницу.");
      } finally {
        setIsLoading(false); // Завершаем загрузку в любом случае
      }
    };

    fetchTasks();
  }, [dispatch]);
  //***** */

  // Форматируем название месяца с локализацией на русский язык и с заглавной буквы
  const formattedMonth = format(currentMonth, "LLLL yyyy", { locale: ru });
  const monthLabel =
    formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

  // Текущая дата — используется для подсветки сегодняшнего дня
  const today = new Date();

  // Показываем лоадер, если данные еще загружаются
  return isLoading ? (
    <div className={styles.loader}>
      <Loader />
    </div>
  ) : (
    // Основной UI календаря с drag and drop контекстом
    <div className={styles.calendar}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Заголовок с месяцем и кнопками переключения */}
        <CalendarHeader
          monthLabel={monthLabel}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
        />
        {/* Отображение дней недели */}
        {/* Основная сетка календаря с днями и задачами */}
        <CalendarGrid days={days} tasks={tasks} today={today} />
      </DragDropContext>
    </div>
  );
};

export default Calendar;

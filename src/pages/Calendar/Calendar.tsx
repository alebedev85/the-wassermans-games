import { DragDropContext } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useSelector } from "react-redux";

import CalendarGrid from "../../components/CalendarGrid/CalendarGrid";
import CalendarHeader from "../../components/CalendarHeader/CalendarHeader";
import Loader from "../../components/Loader/Loader";

import useCalendarDays from "../../hooks/useCalendarDays";
import useCurrentMonth from "../../hooks/useCurrentMonth";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import useLoadCalendar from "../../hooks/useLoadCalendar";
import useSaveBoardState from "../../hooks/useSaveBoardState";
import { RootState } from "../../store";

import styles from "./Calendar.module.scss";

const Calendar = () => {
  // Хук для текущего месяца и переключения месяцев
  const { currentMonth, handleNextMonth, handlePrevMonth } = useCurrentMonth();

  // Хук для обработки drag and drop
  const { handleDragEnd } = useDragAndDrop(currentMonth);

  // Получаем массив дней для текущего месяца
  const days = useCalendarDays(currentMonth);

  // Получаем список задач из Redux store
  const tasks = useSelector((state: RootState) => state.calendar.tasks);

  // Кастомный хук для загрузки данных из Firebase и состояния загрузки
  const { isLoading } = useLoadCalendar();

  // Хук для автоматического сохранения состояния доски при изменениях
  useSaveBoardState();

  // Форматируем название месяца с локализацией на русский язык и с заглавной буквы
  const formattedMonth = format(currentMonth, "LLLL yyyy", { locale: ru });
  const monthLabel =
    formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

  // Текущая дата — используется для подсветки сегодняшнего дня
  const today = new Date();

  // Показываем лоадер, если данные еще загружаются
  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }

  // Основной UI календаря с drag and drop контекстом
  return (
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

import { useMemo } from "react";
import { addDays, endOfMonth, startOfMonth, startOfWeek } from "date-fns";

/**
 * Хук для получения массива всех дней, которые нужно отобразить в календарной сетке.
 * @param currentMonth - Дата начала месяца, для которого нужно построить календарь.
 * @returns Массив дат, представляющих календарные ячейки.
 */
export default function useCalendarDays(currentMonth: Date) {
  /**
   * Вычисляем массив дат только при изменении currentMonth
   */
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);      // Первое число месяца
    const monthEnd = endOfMonth(currentMonth);          // Последнее число месяца
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Начало первой недели с понедельника

    const daysArray: Date[] = [];
    let currentDate = startDate;

    while (currentDate <= monthEnd) {
      daysArray.push(currentDate);
      currentDate = addDays(currentDate, 1); // Добавляем следующий день
    }

    return daysArray;
  }, [currentMonth]);

  return days;
}

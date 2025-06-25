import { useState } from "react";
import { addMonths, subMonths, startOfMonth } from "date-fns";

/**
 * Хук для управления состоянием текущего месяца календаря.
 * Возвращает дату начала месяца и функции для переключения между месяцами.
 */
export default function useCurrentMonth() {
  // Состояние: текущий месяц, инициализируем началом текущего месяца
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));

  /**
   * Переключение на предыдущий месяц
   */
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  /**
   * Переключение на следующий месяц
   */
  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  return {
    currentMonth,       // Дата начала текущего месяца
    handlePrevMonth,    // Функция перехода к предыдущему месяцу
    handleNextMonth     // Функция перехода к следующему месяцу
  };
}

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadCalendar } from "../utils/storageFirebase";
import { setTasks } from "../store/calendarSlice";

/**
 * Кастомный хук для загрузки задач календаря из Firebase
 * и записи их в Redux store.
 * 
 * Возвращает состояние загрузки.
 */
const useLoadCalendar = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Стейт для отображения загрузки

  useEffect(() => {
    // Асинхронная функция для загрузки данных
    const fetchData = async () => {
      setIsLoading(true); // Устанавливаем состояние загрузки в true
      const calendarData = await loadCalendar(); // Загружаем данные из Firebase
      if (calendarData) {
        dispatch(setTasks(calendarData.tasks)); // Записываем задачи в Redux store
      }
      setIsLoading(false); // Завершаем загрузку
    };

    fetchData();
  }, [dispatch]); // Зависимость — dispatch, чтобы эффект запускался один раз

  return { isLoading };
};

export default useLoadCalendar;

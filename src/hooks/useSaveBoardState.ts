import { useEffect } from "react";
import { store } from "../store"; // Подключаем хранилище
import { saveCalendar } from "../utils/storageFirebase"; // Подключаем функцию сохранения календаря в Firebase

// подписка на сохранение данных при изменениях в store
const useSaveCalendarState = () => {
  useEffect(() => {
    //Первичная запись календаря из Redux (который инициализирован LocalStorage)
    // const calendarState = store.getState().calendar;
    // saveCalendar(calendarState);

    //Подписка на дальнейшие изменения
    const unsubscribe = store.subscribe(() => {
      const calendarState = store.getState().calendar; // Получаем состояние календаря из Redux
      saveCalendar(calendarState); // Сохраняем данные календаря в Firebase
    });

    return () => unsubscribe(); // Очистка подписки при размонтировании компонента
  }, []); // Пустой массив зависимостей для однократной подписки
};

export default useSaveCalendarState;

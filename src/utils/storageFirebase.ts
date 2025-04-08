import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Импортируем Firebase
import { Task } from "../types";

// Функция для загрузки данных из Firebase (без использования userId)
export const loadCalendar = async () => {
  const calendarRef = doc(db, "calendar", "default"); // Один документ с данными календаря
  const docSnap = await getDoc(calendarRef); // Получаем документ

  if (docSnap.exists()) {
    return docSnap.data(); // Возвращаем данные календаря
  } else {
    console.log("Документ не найден");
    return null;
  }
};

// Функция для сохранения данных в Firebase (без использования userId)
export const saveCalendar = async (calendarData: { tasks: Task[] }) => {
  const calendarRef = doc(db, "calendar", "default"); // Один документ с данными календаря
  try {
    await setDoc(calendarRef, calendarData); // Сохраняем данные
    console.log("Данные успешно сохранены");
  } catch (error) {
    console.error("Ошибка при сохранении данных", error);
  }
};

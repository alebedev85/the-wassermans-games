import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Импортируем Firebase
import { Task } from "../types";

// // Функция для загрузки данных из Firebase (без использования userId)
// export const loadCalendar = async () => {
//   const calendarRef = doc(db, "calendar", "default"); // Один документ с данными календаря
//   const docSnap = await getDoc(calendarRef); // Получаем документ

//   if (docSnap.exists()) {
//     return docSnap.data(); // Возвращаем данные календаря
//   } else {
//     console.log("Документ не найден");
//     return null;
//   }
// };

// // Функция для сохранения данных в Firebase (без использования userId)
// export const saveCalendar = async (calendarData: { tasks: Task[] }) => {
//   // защита от записи пустого стора
//   if (!calendarData || Object.keys(calendarData.tasks || {}).length === 0)
//     return;

//   const calendarRef = doc(db, "calendar", "default"); // Один документ с данными календаря
//   try {
//     await setDoc(calendarRef, calendarData, { merge: true }); // Сохраняем данные
//     console.log("Данные успешно сохранены");
//   } catch (error) {
//     console.error("Ошибка при сохранении данных", error);
//   }
// };

// Новая работа с данными

// Миграция данных
export const migrateOldCalendarData = async () => {
  const oldRef = doc(db, "calendar", "default");
  const snapshot = await getDoc(oldRef);

  if (!snapshot.exists()) return console.log("Нет старых данных для миграции");

  const data = snapshot.data();
  const tasks = data?.tasks || [];

  console.log(`Найдено ${tasks.length} задач для миграции`);

  const tasksCollection = collection(db, "calendar/default/tasks");

  for (const task of tasks) {
    const taskRef = doc(tasksCollection, task.id);
    await setDoc(taskRef, task);
  }

  console.log("Миграция завершена ✅");
};


// 🔹 Загрузка всех задач
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const tasksCol = collection(db, "calendar/default/tasks");
    const snapshot = await getDocs(tasksCol);

    console.log(`Все задачи загружены ✅`);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  } catch (error) {
    console.error("Ошибка при загрузке всех задач:", error);
    return [];
  }
};

// 🔹 Сохранить или обновить задачу
export const saveTaskInFB = async (task: Task): Promise<void> => {
  try {
    const taskRef = doc(db, "calendar/default/tasks", task.id);
    await setDoc(taskRef, task);
    console.log(`Задача ${task.id} успешно сохранена/обновлена ✅`);
  } catch (error) {
    console.error(`Ошибка при сохранении задачи ${task.id}:`, error);
  }
};

// 🔹 Удалить задачу
export const deleteTaskFromFB = async (taskId: string): Promise<void> => {
  try {
    const taskRef = doc(db, "calendar/default/tasks", taskId);
    await deleteDoc(taskRef);
    console.log(`Задача ${taskId} успешно удалена ✅`);
  } catch (error) {
    console.error(`Ошибка при удалении задачи ${taskId}:`, error);
  }
};

// 🔹 Обновить часть полей (без перезаписи всего документа)
export const updateTaskInFB = async (task: Task): Promise<void> => {
  try {
    const taskRef = doc(db, "calendar/default/tasks", task.id);
    // Преобразуем task в обычный объект без типизации
    await updateDoc(taskRef, { ...task });
    console.log(`Задача ${task.id} успешно обновлена ✅`);
  } catch (error) {
    console.error(`Ошибка при обновлении задачи ${task.id}:`, error);
  }
};

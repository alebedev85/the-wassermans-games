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
import { store } from "../store"; 


// Проверка статуса админа
const checkAdminAccess = () => {
  const state = store.getState();
  const isAdmin = state.auth.status;
  if (!isAdmin) {
    throw new Error("Доступ запрещён: только админ может изменять данные.");
  }
};

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
    console.error("❌ Ошибка при загрузке всех задач:", error);
    return [];
  }
};

// 🔹 Сохранить или обновить задачу
export const saveTaskInFB = async (task: Task): Promise<void> => {
  try {
    checkAdminAccess();
    const taskRef = doc(db, "calendar/default/tasks", task.id);
    await setDoc(taskRef, task);
    console.log(`Задача ${task.id} успешно сохранена/обновлена ✅`);
  } catch (error) {
    console.error(`❌ Ошибка при сохранении задачи ${task.id}:`, error);
  }
};

// 🔹 Удалить задачу
export const deleteTaskFromFB = async (taskId: string): Promise<void> => {
  try {
    checkAdminAccess();
    const taskRef = doc(db, "calendar/default/tasks", taskId);
    await deleteDoc(taskRef);
    console.log(`Задача ${taskId} успешно удалена ✅`);
  } catch (error) {
    console.error(`❌ Ошибка при удалении задачи ${taskId}:`, error);
  }
};

// 🔹 Обновить часть полей (без перезаписи всего документа)
export const updateTaskInFB = async (task: Task): Promise<void> => {
  try {
    checkAdminAccess();
    const taskRef = doc(db, "calendar/default/tasks", task.id);
    // Преобразуем task в обычный объект без типизации
    await updateDoc(taskRef, { ...task });
    console.log(`Задача ${task.id} успешно обновлена ✅`);
  } catch (error) {
    console.error(`❌ Ошибка при обновлении задачи ${task.id}:`, error);
  }
};

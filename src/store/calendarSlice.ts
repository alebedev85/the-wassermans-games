import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Calendar, Task } from "../types";

const initialState: Calendar = {
  tasks: [],
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // Установка состояния
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload; // Обновляем состояние tasks
    },
    // Добавляет новую задачу в список
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    // Перемещаем задачу на новую дату
    moveTask(
      state,
      action: PayloadAction<{ taskId: string; newDate: string }>
    ) {
      const { taskId, newDate } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task) {
        task.date = newDate; // Обновляем дату задачи
      }
    },
    // Удаляет задачу по `id`
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    // Редактирование задачи
    editTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
  },
});

export const { setTasks, addTask, moveTask, deleteTask, editTask } =
  calendarSlice.actions;
export default calendarSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Calendar, Task } from "../types";

const initialState: Calendar = {
  tasks: [],
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // Добавляет новую задачу в список
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    // Перемещает задачу в новый индекс (для Drag & Drop)
    moveTask: (
      state,
      action: PayloadAction<{ taskId: string; newIndex: number }>
    ) => {
      const { taskId, newIndex } = action.payload;
      const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        const [task] = state.tasks.splice(taskIndex, 1); // Удаляем задачу из текущей позиции
        state.tasks.splice(newIndex, 0, task); // Вставляем её в новый индекс
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

export const { addTask, moveTask, deleteTask, editTask } = calendarSlice.actions;
export default calendarSlice.reducer;

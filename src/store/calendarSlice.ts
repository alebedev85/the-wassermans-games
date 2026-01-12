import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Calendar, Task } from "../types";
import {
  deleteTaskFromFB,
  getAllTasks,
  saveTaskInFB,
  updateTaskInFB,
} from "../utils/storageFirebase";

const initialState: Calendar = {
  tasks: [],
  loadTasksStatus: false,
  addTaskStatus: false,
  editTaskStatus: false,
  errors: {
    load: null,
    add: null,
    edit: null,
    delete: null,
  },
};

// 🔹 Загрузка всех задач
export const fetchTasks = createAsyncThunk<Task[]>(
  "calendar/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await getAllTasks();
      return tasks;
    } catch (error) {
      return rejectWithValue("Ошибка загрузки задач");
    }
  }
);

// 🔹 Добавление задачи
export const addTask = createAsyncThunk<Task, Task>(
  "calendar/addTask",
  async (task, { rejectWithValue }) => {
    try {
      await saveTaskInFB(task);
      return task;
    } catch (error) {
      return rejectWithValue("Ошибка добавления задачи");
    }
  }
);

// 🔹 Удаление задачи
export const deleteTask = createAsyncThunk<string, string>(
  "calendar/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteTaskFromFB(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue("Ошибка удаления задачи");
    }
  }
);

// 🔹 Редактирование задачи
export const editTask = createAsyncThunk<Task, Task>(
  "calendar/editTask",
  async (task, { rejectWithValue }) => {
    try {
      await updateTaskInFB(task);
      return task;
    } catch (error) {
      return rejectWithValue("Ошибка обновления задачи");
    }
  }
);

// 🔹 Перемещение задачи (DnD)
export const moveTask = createAsyncThunk<
  { taskId: string; newDate: string },
  { taskId: string; newDate: string }
>("calendar/moveTask", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const task = state.calendar.tasks.find(
      (t: Task) => t.id === payload.taskId
    );

    if (!task) throw new Error("Задача не найдена");

    const updatedTask: Task = { ...task, date: payload.newDate };
    await updateTaskInFB(updatedTask);

    return payload;
  } catch (error) {
    return rejectWithValue("Ошибка перемещения задачи");
  }
});

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // // Установка состояния
    // setTasks(state, action: PayloadAction<Task[]>) {
    //   state.tasks = action.payload; // Обновляем состояние tasks
    // },
    // // Добавляет новую задачу в список
    // addTask: (state, action: PayloadAction<Task>) => {
    //   state.tasks.push(action.payload);
    // },
    // // Перемещаем задачу на новую дату
    // moveTask(
    //   state,
    //   action: PayloadAction<{ taskId: string; newDate: string }>
    // ) {
    //   const { taskId, newDate } = action.payload;
    //   const task = state.tasks.find((task) => task.id === taskId);
    //   if (task) {
    //     task.date = newDate; // Обновляем дату задачи
    //   }
    // },
    // // Удаляет задачу по `id`
    // deleteTask: (state, action: PayloadAction<string>) => {
    //   state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    // },
    // // Редактирование задачи
    // editTask: (state, action: PayloadAction<Task>) => {
    //   const index = state.tasks.findIndex((t) => t.id === action.payload.id);
    //   if (index !== -1) {
    //     state.tasks[index] = action.payload;
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Загрузка
      .addCase(fetchTasks.pending, (state) => {
        state.loadTasksStatus = true;
        state.errors.load = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loadTasksStatus = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        console.log(action.payload);
        state.loadTasksStatus = false;
        state.errors.load = action.payload as string;
      })

      // 🔹 Добавление задачи
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      // 🔹 Редактирование
      .addCase(editTask.pending, (state) => {
        state.editTaskStatus = true;
        state.errors.add = null;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.editTaskStatus = false;
      })
      .addCase(editTask.rejected, (state, action) => {
        state.editTaskStatus = false;
        state.errors.add = action.payload as string;
      })

      // 🔹 Перемещение (DnD)
      .addCase(moveTask.fulfilled, (state, action) => {
        const { taskId, newDate } = action.payload;
        const task = state.tasks.find((t) => t.id === taskId);
        if (task) {
          task.date = newDate;
        }
      })

      // 🔹 Удаление задач
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      });
  },
});

// export const { setTasks, addTask, moveTask, deleteTask, editTask } =
//   calendarSlice.actions;
export default calendarSlice.reducer;

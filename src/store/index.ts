import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "../utils/storageUtils";
import calendarReducer from "./calendarSlice";
import deleteTaskModalReducer from "./deleteTaskModalSlice";
import taskModalReducer from "./taskModalSlice";
import themeReducer from "./themeSlice";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    calendar: calendarReducer,
    taskModal: taskModalReducer,
    deleteTaskModal: deleteTaskModalReducer,
  },
  preloadedState: preloadedState
    ? {
        theme: preloadedState.theme,
        calendar: preloadedState.calendar,
      }
    : undefined,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

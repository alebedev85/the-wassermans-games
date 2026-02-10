import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "../utils/storageUtils";
import calendarReducer from "./calendarSlice";
import deleteTaskModalReducer from "./deleteTaskModalSlice";
import taskModalReducer from "./taskModalSlice";
import themeReducer from "./themeSlice";
import authReducer from "./authSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    calendar: calendarReducer,
    taskModal: taskModalReducer,
    deleteTaskModal: deleteTaskModalReducer,
    auth: authReducer,
  },
  preloadedState: preloadedState
    ? {
        theme: preloadedState.theme,
        // calendar: preloadedState.calendar,
      }
    : undefined,
});

store.subscribe(() => {
  saveState({
    theme: store.getState().theme,
    calendar: store.getState().calendar,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

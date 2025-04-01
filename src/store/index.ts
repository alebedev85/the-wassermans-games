import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import calendarReducer from "./calendarSlice";
import { loadState, saveState } from "../utils/storageUtils";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    calendar: calendarReducer,
  },
  preloadedState: preloadedState
    ? {
        theme: preloadedState.theme,
        calendar: preloadedState.calendar,
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

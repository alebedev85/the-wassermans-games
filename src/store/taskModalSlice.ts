import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../types";

interface TaskModalState {
  isOpen: boolean;
  task: Task | null;
}

const initialState: TaskModalState = {
  isOpen: false,
  task: null,
};

const taskModalSlice = createSlice({
  name: "taskModal",
  initialState,
  reducers: {
    openTaskModal: (state, action: PayloadAction<Task>) => {
      state.isOpen = true;
      state.task = action.payload;
    },
    closeTaskModal: (state) => {
      state.isOpen = false;
      state.task = null;
    },
  },
});

export const { openTaskModal, closeTaskModal } = taskModalSlice.actions;
export default taskModalSlice.reducer;

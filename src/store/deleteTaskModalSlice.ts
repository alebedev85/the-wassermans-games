import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../types";

interface DeleteTaskModalState {
  isOpen: boolean;
  task: Task | null;
}

const initialState: DeleteTaskModalState = {
  isOpen: false,
  task: null,
};

const deleteTaskModalSlice = createSlice({
  name: "deleteTaskModal",
  initialState,
  reducers: {
    openDeleteModal: (state, action: PayloadAction<Task>) => {
      state.isOpen = true;
      state.task = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isOpen = false;
      state.task = null;
    },
  },
});

export const { openDeleteModal, closeDeleteModal } = deleteTaskModalSlice.actions;
export default deleteTaskModalSlice.reducer;

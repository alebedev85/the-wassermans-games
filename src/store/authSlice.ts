import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { User } from "../types";

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  isLoading: boolean;
}

// Начальное состояние, берем данные из localStorage
const storedUser = localStorage.getItem("user");

// Начальное состояние
const initialState: AuthState = storedUser
  ? {
      isAuthenticated: true,
      user: JSON.parse(storedUser),
      isLoading: false,
    }
  : {
      isAuthenticated: false,
      user: { name: null, token: null, id: null },
      isLoading: false,
    };

// Создаем слайс аутентификации
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginFinish: (state) => {
      state.isLoading = false;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
    },
    loginFailure: (state) => {
      state.isLoading = false;
    },
    logout: () => initialState,
  },
});

export const {
  loginStart,
  loginFinish,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;

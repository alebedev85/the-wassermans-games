import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { User } from "../types";

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  status: string | null
  isLoading: boolean;
}

// Начальное состояние, берем данные из localStorage
const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

// Начальное состояние
const initialState: AuthState = parsedUser
  ? {
      isAuthenticated: true,
      user: parsedUser,
      status: parsedUser.email ? parsedUser.email.split("@")[0] : null,
      isLoading: false,
    }
  : {
      isAuthenticated: false,
      user: { email: null, token: null, id: null },
      status: null,
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
      state.status=state.user.email? state.user.email.split("@")[0] : null
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

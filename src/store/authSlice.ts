import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { User } from "../types";
import { login, logout } from "../utils/authService";

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  status: string | null;
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

export const LoginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await login(email, password);
    } catch (err) {
      return rejectWithValue("Ошибка сервера");
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (state.auth.isLoading) {
        return false;
      }
    },
  }
);

export const LogoutUser = createAsyncThunk("auth/logout", async () => {
  await logout();
});

// Создаем слайс аутентификации
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.status = state.user.email ? state.user.email.split("@")[0] : null;
      state.isLoading = false;
    },
    clearUser: () => initialState,
  },
  extraReducers: (builder) => {
    //Логин
    builder.addCase(LoginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.status = state.user.email ? state.user.email.split("@")[0] : null;
      state.isLoading = false;
    });
    builder.addCase(LoginUser.rejected, (state) => {
      state.isLoading = false;
    });
    //Логаут
    builder.addCase(LogoutUser.fulfilled, () => initialState);
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;

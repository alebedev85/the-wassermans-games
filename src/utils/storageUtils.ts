import { RootState } from "../store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loadState = (): any => {
  try {
    const serializedState = localStorage.getItem("boardState");
    return serializedState
      ? (JSON.parse(serializedState) as RootState)
      : undefined;
  } catch (err) {
    console.error("Ошибка загрузки состояния:", err);
    return undefined;
  }
};

export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("boardState", serializedState);
  } catch (err) {
    console.error("Ошибка сохранения состояния:", err);
  }
};

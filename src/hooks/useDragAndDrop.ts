import { DropResult } from "@hello-pangea/dnd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { moveTask } from "../store/calendarSlice";
import { Task } from "../types";
import { updateTaskInFB } from "../utils/storageFirebase";

/**
 * Хук для загрузки задач и обработки DnD в календаре.
 * @returns handleDragEnd - функция для DragDropContext
 */
const useDragAndDrop = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const tasks = useAppSelector((state) => state.calendar.tasks);
  /**
   * Обработчик завершения drag-and-drop.
   * @param result - объект, содержащий информацию о перетаскивании
   */
  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      // Если пользователь не админ — не даём ничего перетаскивать
      if (!status) return;

      const { destination, source, draggableId } = result;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      dispatch(
        moveTask({ taskId: draggableId, newDate: destination.droppableId })
      );

      // Находим задачу, чтобы обновить её на сервере
      const movedTask = tasks.find((t) => t.id === draggableId);
      if (!movedTask) return;

      // Обновляем поле date в Firestore
      try {
        await updateTaskInFB({
          ...movedTask,
          date: destination.droppableId,
        } as Task);
      } catch {
        alert("Ошибка при обновлении задачи в Firebase:");
      }
    },
    [dispatch, status, tasks]
  );

  return { handleDragEnd };
};

export default useDragAndDrop;

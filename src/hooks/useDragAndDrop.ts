import { DropResult } from "@hello-pangea/dnd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { moveTaskOptimistic, syncMoveTask } from "../store/calendarSlice";

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
        moveTaskOptimistic({
          taskId: draggableId,
          newDate: destination.droppableId,
        })
      );

      // 🔹 синхронизируем с сервером
      dispatch(
        syncMoveTask({ taskId: draggableId, newDate: destination.droppableId })
      )
        .unwrap()
        .catch(() => alert("Ошибка при сохранении задачи на сервере"));
    },
    [dispatch, status, tasks]
  );

  return { handleDragEnd };
};

export default useDragAndDrop;

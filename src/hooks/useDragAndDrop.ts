import { DropResult } from "@hello-pangea/dnd";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { moveTask } from "../store/calendarSlice";

/**
 * Хук для загрузки задач и обработки DnD в календаре.
 * @returns handleDragEnd - функция для DragDropContext
 */
const useDragAndDrop = () => {
  const dispatch = useDispatch();
  /**
   * Обработчик завершения drag-and-drop.
   * @param result - объект, содержащий информацию о перетаскивании
   */
  const handleDragEnd = useCallback(
    (result: DropResult) => {
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
    },
    [dispatch]
  );

  return { handleDragEnd };
};

export default useDragAndDrop;

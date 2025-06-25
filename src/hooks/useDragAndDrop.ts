// src/hooks/useDragAndDrop.ts

import { DropResult } from "@hello-pangea/dnd";
import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { moveTask, setTasks } from "../store/calendarSlice";
import { loadCalendar } from "../utils/storageFirebase";

/**
 * Хук для загрузки задач и обработки DnD в календаре.
 * @param currentMonth - текущий выбранный месяц
 * @returns handleDragEnd - функция для DragDropContext
 */
const useDragAndDrop = (currentMonth: Date) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

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

  // Загружаем данные из Firebase один раз при изменении месяца
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const calendarData = await loadCalendar();
      if (calendarData) {
        dispatch(setTasks(calendarData.tasks));
      }
      setIsLoading(false);
    };

    fetchData();
  }, [currentMonth, dispatch]);

  return { handleDragEnd, isLoading };
};

export default useDragAndDrop;

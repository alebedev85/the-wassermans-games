import { useRef, useState } from "react";

/**
 * Хук вычисляет, в какую сторону лучше открыть выпадающее меню,
 * чтобы оно не вылезло за пределы экрана.
 */
export const useDropdownPosition = () => {
  // Кнопка / триггер
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  //Выпадающее меню
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [alignRight, setAlignRight] = useState(false);
  const [alignTop, setAlignTop] = useState(false);

  //Вызывается ТОЛЬКО в момент открытия меню
  const updatePosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    const spaceRight = window.innerWidth - triggerRect.left;
    const spaceBottom = window.innerHeight - triggerRect.bottom;

    setAlignRight(spaceRight < dropdownRect.width);
    setAlignTop(spaceBottom < dropdownRect.height);
  };

  return {
    triggerRef,
    dropdownRef,
    alignRight,
    alignTop,
    updatePosition,
  };
};

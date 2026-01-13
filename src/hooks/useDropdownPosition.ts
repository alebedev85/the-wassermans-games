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

    // Получаем координаты и размеры кнопки-триггера
    const triggerRect = triggerRef.current.getBoundingClientRect();

    // Получаем размеры выпадающего меню
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    // Сколько места справа от кнопки до края окна
    const spaceRight = window.innerWidth - triggerRect.left;

    // Сколько места снизу от кнопки до нижнего края окна
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

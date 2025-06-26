import styles from "./CalendarHeader.module.scss";

interface CalendarHeaderProps {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Компонент `CalendarHeader`
 * Отображает заголовок календаря с названием месяца и кнопками переключения месяца.
 *
 * @param {string} monthLabel - Название месяца (например, "Июнь 2025")
 * @param {Function} onPrev - Колбэк, вызываемый при нажатии на кнопку «Назад»
 * @param {Function} onNext - Колбэк, вызываемый при нажатии на кнопку «Вперёд»
 */
const CalendarHeader = ({
  monthLabel,
  onPrev,
  onNext,
}: CalendarHeaderProps) => {
  return (
    <div className={styles.header}>
      {/* Кнопка переключения на предыдущий месяц */}
      <button onClick={onPrev}>{"<"}</button>

      {/* Заголовок с названием месяца */}
      <h2>{monthLabel}</h2>

      {/* Кнопка переключения на следующий месяц */}
      <button onClick={onNext}>{">"}</button>
    </div>
  );
};

export default CalendarHeader;

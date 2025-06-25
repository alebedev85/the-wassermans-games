import styles from "./CalendarHeader.module.scss";

interface CalendarHeaderProps {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
}

const CalendarHeader = ({ monthLabel, onPrev, onNext }: CalendarHeaderProps) => {
  return (
    <div className={styles.header}>
      <button onClick={onPrev}>{"<"}</button>
      <h2>{monthLabel}</h2>
      <button onClick={onNext}>{">"}</button>
    </div>
  );
};

export default CalendarHeader;

import styles from "./WeekDay.module.scss";

interface WeekDayProps {
  label: string;
  isWeekend: boolean;
}

const WeekDay = ({ label, isWeekend }: WeekDayProps) => {
  return (
    <div className={`${styles.weekDay} ${isWeekend ? styles.weekend : ""}`}>
      {label}
    </div>
  );
};

export default WeekDay;

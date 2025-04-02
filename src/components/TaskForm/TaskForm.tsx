import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addTask } from "../../store/calendarSlice";
import { Task } from "../../types";
import styles from "./TaskForm.module.scss";

interface TaskFormProps {
  selectedDate: Date;
  onClose: () => void;
}

interface TaskFormValues {
  title: string;
  description?: string;
}

const TaskForm = ({ selectedDate, onClose }: TaskFormProps) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm<TaskFormValues>();

  const onSubmit = (data: TaskFormValues) => {
    if (data.title.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description || "",
        date: selectedDate.toISOString(),
      };
      dispatch(addTask(newTask));
      reset();
      onClose();
    }
  };

  return (
    <form className={styles.taskForm} onSubmit={handleSubmit(onSubmit)}>
      <h3>Новая задача на {selectedDate.toLocaleDateString()}</h3>
      <input {...register("title", { required: true })} type="text" placeholder="Название задачи" />
      <textarea {...register("description")} placeholder="Описание (необязательно)" />
      <div className={styles.controls}>
        <button type="submit" className={styles.addButton}>Добавить</button>
        <button type="button" className={styles.closeButton} onClick={onClose}>Закрыть</button>
      </div>
    </form>
  );
};

export default TaskForm;

import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "../../assets/artwork.png";
import { RootState } from "../../store";
import { editTask } from "../../store/calendarSlice";
import { closeTaskModal } from "../../store/taskModalSlice";
import { Task } from "../../types";
import styles from "./TaskModal.module.scss";

const TaskModal = () => {
  const dispatch = useDispatch();
  const { isOpen, task } = useSelector((state: RootState) => state.taskModal);

  // Устанавливаем начальные значения для title, description, price и location
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [price, setPrice] = useState(task?.price || "");
  const [time, setTime] = useState(task?.time || "");
  const [location, setLocation] = useState(task?.location || "");

  // Используем useEffect, чтобы обновить состояние при изменении task
  useEffect(() => {
    setData();
  }, [task]);

  const setData = () => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPrice(task.price || "");
      setTime(task.time || "");
      setLocation(task.location || "");
    }
  };

  // Проверка: изменились ли данные
  const isChanged =
    task &&
    (title !== task.title ||
      description !== task.description ||
      price !== task.price ||
      time !== task.time ||
      location !== task.location);

  if (!isOpen || !task) return null;

  // Сохранить изменения
  const handleSave = () => {
    if (isChanged) {
      const updatedTask: Task = {
        ...task,
        title,
        time,
        price,
        location,
        description,
      }; // Добавляем цену и место
      dispatch(editTask(updatedTask));
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => dispatch(closeTaskModal())}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия (крестик) */}
        <button
          className={styles.closeButton}
          onClick={() => dispatch(closeTaskModal())}
        >
          ✖
        </button>

        {/* Заголовок редактируется при клике */}
        <input
          className={classNames(styles.input, styles.titleInput)}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <img
          src={task.imageUrl || Image}
          alt={task.title}
          className={styles.image}
        />

        {/* Лейбл и поле ввода для цены */}
        <div className={styles.inputWrapper}>
          <label htmlFor="price" className={styles.label}>
            Начало:
          </label>
          <input
            id="time"
            className={classNames(styles.input, styles.timeInput)}
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Цена"
          />
        </div>

        {/* Лейбл и поле ввода для цены */}
        <div className={styles.inputWrapper}>
          <label htmlFor="price" className={styles.label}>
            Цена:
          </label>
          <input
            id="price"
            className={classNames(styles.input, styles.priceInput)}
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Цена"
          />
        </div>

        {/* Лейбл и поле ввода для места */}
        <div className={styles.inputWrapper}>
          <label htmlFor="location" className={styles.label}>
            Место:
          </label>
          <input
            id="location"
            className={classNames(styles.input, styles.locationInput)}
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Место"
          />
        </div>

        {/* Описание редактируется при клике */}

        <label htmlFor="description" className={styles.label}>
          Описание:
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={styles.controls}>
          <button
            className={classNames(styles.saveButton, {
              [styles.disabled]: !isChanged,
            })}
            onClick={handleSave}
            disabled={!isChanged} // Дизейблим кнопку при отсутствии изменений
          >
            Сохранить
          </button>
          <button
            className={classNames(styles.counselButton, {
              [styles.disabled]: !isChanged,
            })}
            onClick={() => setData()}
            disabled={!isChanged}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

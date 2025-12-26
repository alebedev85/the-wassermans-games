import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { editTask } from "../../store/calendarSlice";
import { closeTaskModal } from "../../store/taskModalSlice";
import { Task } from "../../types";
import { updateTaskInFB } from "../../utils/storageFirebase";
import Loader from "../Loader/Loader";
import ImageArea from "../ui/ImageArea/ImageArea";
import InputArea from "../ui/InputArea/InputArea";
import LinkArea from "../ui/LinkArea/LinkArea";
import TextArea from "../ui/TextArea/TextArea";
import styles from "./TaskModal.module.scss";
import TaskModalControls from "./TaskModalControls/TaskModalControls";

const TaskModal = () => {
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useAppDispatch();
  const { isOpen, task } = useAppSelector((state) => state.taskModal);
  const { status } = useAppSelector((state) => state.auth);
  const [initialTask, setInitialTask] = useState<Task | null>(null);
  // Устанавливаем начальные значения для title, description, price и location
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [price, setPrice] = useState(task?.price || "");
  const [time, setTime] = useState(task?.time || "");
  const [location, setLocation] = useState(task?.location || "");
  const [imageUrl, setImageUrl] = useState(task?.imageUrl || null);
  const [link, setLink] = useState(task?.link || "");
  const [linkError, setLinkError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Используем useEffect, чтобы обновить состояние при изменении task
  useEffect(() => {
    setInitialTask(task);
    setData();
    setLinkError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const setData = () => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPrice(task.price || "");
      setTime(task.time || "");
      setLocation(task.location || "");
      setImageUrl(task.imageUrl || null);
      setLink(task.link || "");
    }
    setLinkError("");
    setIsEditMode(false);
  };

  const handleClose = () => {
    setImageUrl(""); // сброс превью
    dispatch(closeTaskModal());
  };

  // Проверка: изменились ли данные
  const isChanged =
    initialTask &&
    (title !== initialTask.title ||
      description !== initialTask.description ||
      price !== initialTask.price ||
      time !== initialTask.time ||
      location !== initialTask.location ||
      imageUrl !== initialTask.imageUrl ||
      link !== initialTask.link);

  if (!isOpen || !task) return null;

  const validateLink = (value: string) => {
    if (!value) {
      setLinkError("");
      return true;
    }
    if (!value.startsWith("https://t.me/c/1767036997/")) {
      setLinkError("Ссылка должна начинаться с https://t.me/c/1767036997/");
      return false;
    }
    setLinkError("");
    return true;
  };

  // Сохранить изменения
  const handleSave = async () => {
    const isValidLink = validateLink(link);

    if (!isValidLink) return;

    if (isChanged) {
      const updatedTask: Task = {
        ...task,
        title,
        time,
        price,
        location,
        description,
        imageUrl,
        link,
      };
      try {
        setIsUploading(true);
        await updateTaskInFB(updatedTask);
        dispatch(editTask(updatedTask));
        setInitialTask(updatedTask);
        setIsEditMode(false);
      } catch (error) {
        console.error("Не удалось сохранить задачу:", error);
        alert("Ошибка при сохранении задачи. Попробуйте снова.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {isUploading ? (
          <Loader />
        ) : (
          <div className={styles.scrollableInner}>
            {/* Кнопка закрытия (крестик) */}
            <button className={styles.closeButton} onClick={handleClose}>
              ✖
            </button>

            <div className={styles.content}>
              {/* Заголовок */}
              <TextArea
                value={title}
                onChange={setTitle}
                isEditMode={isEditMode}
                isTitle={true}
              />
              {/* Дата игры */}
              <p className={styles.date}>
                {new Date(task?.date)
                  .toLocaleDateString("ru-RU", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  .replace(/^./, (s) => s.toUpperCase())}
              </p>
              {/* Изображение */}
              <ImageArea
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                isEditMode={isEditMode}
              />
              {/* Поля с данными */}
              <InputArea
                label={"🕖 Начало"}
                value={time}
                onChange={setTime}
                isEditMode={isEditMode}
              />
              <InputArea
                label={"💵 Цена"}
                value={price}
                onChange={setPrice}
                isEditMode={isEditMode}
              />
              <InputArea
                label={"📍 Место"}
                value={location}
                onChange={setLocation}
                isEditMode={isEditMode}
              />
              {/* Ссылка */}
              <LinkArea
                link={link}
                onChange={setLink}
                linkError={linkError}
                isEditMode={isEditMode}
              />
              {/* Описание */}
              <TextArea
                label={"📝 Описание"}
                value={description}
                onChange={setDescription}
                isEditMode={isEditMode}
              />
            </div>
            {/* Кнопки управления */}
            {status && (
              <TaskModalControls
                disabled={!isChanged}
                handleSave={handleSave}
                handleCancel={setData}
                isEditMode={isEditMode}
                setIsEditMode={() => setIsEditMode(true)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;

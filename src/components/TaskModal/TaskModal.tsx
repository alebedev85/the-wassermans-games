import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fallbackImage from "../../assets/artwork.png";
import { RootState } from "../../store";
import { editTask } from "../../store/calendarSlice";
import { closeTaskModal } from "../../store/taskModalSlice";
import { Task } from "../../types";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import Loader from "../Loader/Loader";
import InputArea from "../ui/InputArea/InputArea";
import LinkBlock from "../ui/LinkBlock/LinkBlock";
import styles from "./TaskModal.module.scss";

const TaskModal = () => {
  const dispatch = useDispatch();
  const { isOpen, task } = useSelector((state: RootState) => state.taskModal);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [initialTask, setInitialTask] = useState<Task | null>(null);
  // Устанавливаем начальные значения для title, description, price и location
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [price, setPrice] = useState(task?.price || "");
  const [time, setTime] = useState(task?.time || "");
  const [location, setLocation] = useState(task?.location || "");
  const [imageUrl, setImageUrl] = useState(task?.imageUrl || null);
  const [link, setLink] = useState(task?.link || "");
  const [isEditLink, setIsEditLink] = useState(false);
  const [linkError, setLinkError] = useState("");

  // Используем useEffect, чтобы обновить состояние при изменении task
  useEffect(() => {
    setInitialTask(task);
    setData();
    setIsEditLink(false);
    setLinkError("");
    requestAnimationFrame(() => {
      handleTextareaInput();
    });
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
    setIsEditLink(false);
    setLinkError("");
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
  const handleSave = () => {
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
      dispatch(editTask(updatedTask));
      setInitialTask(updatedTask);
      setIsEditLink(false);
    }
  };

  function handleTextareaInput() {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // сначала сбросим
      textarea.style.height = `${textarea.scrollHeight}px`; // установим по содержимому
    }
  }

  // Обработчик выбора изображения
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const url = await uploadImageToCloudinary(file);
        setImageUrl(url);
      } catch (err) {
        console.error("Ошибка загрузки изображения:", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия (крестик) */}
        <button className={styles.closeButton} onClick={handleClose}>
          ✖
        </button>

        {/* Заголовок редактируется при клике */}
        <div className={styles.data}>
          <span className={styles.date}>
            {new Date(task?.date)
              .toLocaleDateString("ru-RU", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
              .replace(/^./, (s) => s.toUpperCase())}
          </span>
          
          <InputArea value={title} onChange={setTitle} isTitle={true} />

          <div className={styles.imgWrapper}>
            {isUploading ? (
              <div className={styles.previewImage}>
                <Loader />
              </div>
            ) : (
              <img
                src={imageUrl || fallbackImage}
                alt="Preview"
                className={styles.previewImage}
              />
            )}
            <label className={styles.customFileUpload}>
              {isUploading
                ? "Загружается..."
                : imageUrl
                ? "Изменить изображение"
                : "Загрузить изображение"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <InputArea label={"Начало"} value={time} onChange={setTime} />
          <InputArea label={"Цена"} value={price} onChange={setPrice} />
          <InputArea label={"Место"} value={location} onChange={setLocation} />
          <LinkBlock
            link={link}
            onChange={setLink}
            linkError={linkError}
            isEditLink={isEditLink}
            setIsEditLink={setIsEditLink}
          />

          {/* Описание редактируется при клике */}
          <label htmlFor="description" className={styles.label}>
            Описание:
          </label>
          <textarea
            ref={textareaRef}
            id="description"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onInput={handleTextareaInput}
          />
        </div>

        <div className={styles.controls}>
          <button
            className={classNames(styles.saveButton, {
              [styles.disabled]: !isChanged,
            })}
            onClick={handleSave}
            disabled={!isChanged} // Дизейблим кнопку при отсутствии изменений
          >
            Редактировать
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

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import fallbackImage from "../../assets/artwork.png";
import { RootState } from "../../store";
import { editTask } from "../../store/calendarSlice";
import { closeTaskModal } from "../../store/taskModalSlice";
import { Task } from "../../types";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import Loader from "../Loader/Loader";
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

  const handelEditLink = () => {
    setIsEditLink(!isEditLink);
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
          <div className={styles.inputBlock}>
            <input
              className={classNames(styles.input, styles.titleInput)}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

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
              className={classNames(
                styles.input,
                styles.locationInput,
                "tooltip"
              )}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Место"
            />
          </div>

          <div className={styles.linkBlock}>
            {link ? (
              <div style={{ width: "100%" }}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  onClick={(e) => e.stopPropagation()}
                >
                  Запись на игру
                </a>
                <button
                  className={classNames(styles.editLinkButton, "tooltip")}
                  data-tooltip="Редактировать ссылку"
                  onClick={handelEditLink}
                >
                  <FaEdit />
                </button>
              </div>
            ) : (
              <button
                className={styles.customFileUpload}
                onClick={handelEditLink}
              >
                Добавить ссылку в ТГ
              </button>
            )}
            {isEditLink && (
              <div className={styles.linkInputBlock}>
                <input
                  id="location"
                  className={classNames(styles.input, styles.linkInput)}
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Ссылка в ТГ"
                />
                {linkError && <span className={styles.error}>{linkError}</span>}
              </div>
            )}
          </div>

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

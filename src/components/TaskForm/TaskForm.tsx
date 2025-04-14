import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import fallbackImage from "../../assets/artwork.png";
import { addTask } from "../../store/calendarSlice";
import { Task } from "../../types";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import Loader from "../Loader/Loader";
import styles from "./TaskForm.module.scss";

interface TaskFormProps {
  selectedDate: Date;
  onClose: () => void;
}

const TaskForm = ({ selectedDate, onClose }: TaskFormProps) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Task>();

  const onSubmit = (data: Task) => {
    if (data.title.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: data.title,
        time: data.time,
        description: data.description || "",
        price: data.price,
        link: data.link,
        location: data.location,
        date: selectedDate.toISOString(),
        imageUrl,
      };
      dispatch(addTask(newTask));
      reset();
      onClose();
    }
  };

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
    <form className={styles.taskForm} onSubmit={handleSubmit(onSubmit)}>
      <h3>Новая игра на {selectedDate.toLocaleDateString()}</h3>

      {/* Поле Названия */}
      <div className={styles.inputBlock}>
        <input
          {...register("title", { required: "Название обязательно" })}
          type="text"
          placeholder="Название игры"
        />
        {errors.title && (
          <span className={styles.error}>{errors.title.message}</span>
        )}
      </div>

      {/* Поле время */}
      <div className={styles.inputBlock}>
        <input
          {...register("time", {
            required: "Время начала игры обязательно",
            pattern: {
              value: /^(?:[01][0-9]|2[0-3])[:.][0-5][0-9]$/,
              message: "Время должно быть в формате HH:mm или HH.mm",
            },
          })}
          type="text"
          placeholder="Начало игры (HH:mm или HH.mm)"
        />
        {errors.time && (
          <span className={styles.error}>{errors.time.message}</span>
        )}
      </div>

      {/* Поле Цена */}
      <div className={styles.inputBlock}>
        <input
          {...register("price", {
            required: "Цена обязательна",
          })}
          type="text"
          placeholder="Цена"
        />
        {errors.price && (
          <span className={styles.error}>{errors.price.message}</span>
        )}
      </div>

      {/* Поле Количество мест */}
      <div className={styles.inputBlock}>
        <input
          {...register("location", {
            required: "Введите место провидения",
          })}
          type="text"
          placeholder="Место"
        />
        {errors.location && (
          <span className={styles.error}>{errors.location.message}</span>
        )}
      </div>

      <div className={styles.inputBlock}>
        <input
          {...register("link", {
            validate: (value?: string) =>
              !value ||
              value.startsWith("https://t.me/c/1767036997/") ||
              "Ссылка должна начинаться с https://t.me/c/1767036997/",
          })}
          type="text"
          placeholder="Ссылка в ТГ (необязательно)"
        />
        {errors.link && (
          <span className={styles.error}>{errors.link.message}</span>
        )}
      </div>

      {/* Поле для загрузки изображения */}
      <div className={styles.inputBlock}>
        <label className={styles.customFileUpload}>
          {isUploading
            ? "Загружается..."
            : imageUrl
            ? "Изменить изображение"
            : "Загрузить изображение"}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {isUploading ? (
          <div className={styles.previewImage}>
            <Loader />
          </div>
        ) : (
          <img
            src={imageUrl || fallbackImage}
            alt="Preview"
            className={styles.previewImage}
            loading="lazy"
          />
        )}
      </div>

      {/* Поле Описания */}
      <textarea
        {...register("description")}
        placeholder="Описание (необязательно)"
      />

      <div className={styles.controls}>
        <button type="submit" className={styles.addButton}>
          Добавить
        </button>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          Отмена
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

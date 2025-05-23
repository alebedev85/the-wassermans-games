import { useState } from "react";
import fallbackImage from "../../../assets/artwork.png";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import Loader from "../../Loader/Loader";
import styles from "./ImageArea.module.scss";

interface ImageAreaProps {
  imageUrl: string | null;
  setImageUrl: (value: string) => void;
  isEditMode: boolean;
}

export default function ImageArea({
  imageUrl,
  setImageUrl,
  isEditMode,
}: ImageAreaProps) {
  const [isUploading, setIsUploading] = useState(false);

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
    <div className={styles.imageArea}>
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
      {isEditMode && (
        <label className={styles.customFileUpload}>
          {isUploading
            ? "Загружается..."
            : imageUrl
            ? "Изменить изображение"
            : "Загрузить изображение"}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      )}
    </div>
  );
}

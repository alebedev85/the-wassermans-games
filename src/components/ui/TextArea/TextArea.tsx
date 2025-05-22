import { useEffect, useRef } from "react";
import styles from "./TextArea.module.scss";

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditMode: boolean;
}

export default function TextArea({ label, value, onChange, isEditMode }: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      handleTextareaInput();
    });
  })

  function handleTextareaInput() {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // сначала сбросим
      textarea.style.height = `${textarea.scrollHeight}px`; // установим по содержимому
    }
  }
  return (
    <div>
      <label htmlFor="description" className={styles.label}>
        {label}:
      </label>
      <textarea
        ref={textareaRef}
        id="description"
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={handleTextareaInput}
        disabled={!isEditMode}
      />
    </div>
  );
}

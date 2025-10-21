import classNames from "classnames";
import { useEffect, useRef } from "react";
import styles from "./TextArea.module.scss";

interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  isEditMode: boolean;
  isTitle?: boolean;
}

export default function TextArea({
  label,
  value,
  onChange,
  isEditMode,
  isTitle,
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      handleTextareaInput();
    });
  });

  function handleTextareaInput() {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = "auto"; // сначала сбросим
      textarea.style.height = `${textarea.scrollHeight}px`; // установим по содержимому
    }
  }
  return (
    <div>
      {!isTitle && (
        <label htmlFor="description" className={styles.label}>
          {label}:
        </label>
      )}
      <textarea
        ref={textareaRef}
        rows={1}
        className={classNames(styles.textarea, isTitle ? styles.title : "")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={handleTextareaInput}
        disabled={!isEditMode}
      />
    </div>
  );
}

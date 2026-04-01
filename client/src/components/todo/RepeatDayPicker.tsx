import styles from './RepeatDayPicker.module.css';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface RepeatDayPickerProps {
  selected: number[];
  onChange: (days: number[]) => void;
  readonly?: boolean;
}

export default function RepeatDayPicker({
  selected,
  onChange,
  readonly = false,
}: RepeatDayPickerProps) {
  const toggle = (day: number) => {
    if (readonly) return;
    if (selected.includes(day)) {
      onChange(selected.filter(d => d !== day));
    } else {
      onChange([...selected, day].sort());
    }
  };

  return (
    <div className={styles.container}>
      {DAYS.map((label, index) => (
        <button
          key={index}
          type="button"
          className={`${styles.day} ${selected.includes(index) ? styles.active : ''} ${readonly ? styles.readonly : ''}`}
          onClick={() => toggle(index)}
          tabIndex={readonly ? -1 : 0}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

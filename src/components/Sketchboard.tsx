import type { Assignment, Meal } from '../types';
import { DAY_NAMES } from '../types';
import { DaySlot } from './DaySlot';

type Props = {
  assignments: Assignment[];
  meals: Meal[];
  startDay: number;
  onStartDayChange: (day: number) => void;
  onRemove: (assignmentId: string) => void;
};

export function Sketchboard({ assignments, meals, startDay, onStartDayChange, onRemove }: Props) {
  const dayOrder = Array.from({ length: 7 }, (_, i) => (startDay + i) % 7);

  return (
    <div className="sketchboard">
      <div className="sketchboard-toolbar">
        <label className="start-day-label">
          Start day
          <select
            className="start-day-select"
            value={startDay}
            onChange={(e) => onStartDayChange(parseInt(e.target.value))}
          >
            {DAY_NAMES.map((name, i) => (
              <option key={i} value={i}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="sketchboard-grid">
        {dayOrder.map((dayIdx) => (
          <DaySlot
            key={dayIdx}
            dayIndex={dayIdx}
            dayName={DAY_NAMES[dayIdx]}
            assignments={assignments}
            meals={meals}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

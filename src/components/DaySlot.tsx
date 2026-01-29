import { Droppable } from '@hello-pangea/dnd';
import type { Assignment, Meal } from '../types';
import { MealChip } from './MealChip';

type Props = {
  dayIndex: number;
  dayName: string;
  assignments: Assignment[];
  meals: Meal[];
  onRemove: (assignmentId: string) => void;
};

function getTodayIndex(): number {
  const jsDay = new Date().getDay(); // 0=Sun
  return jsDay === 0 ? 6 : jsDay - 1; // 0=Mon
}

export function DaySlot({ dayIndex, dayName, assignments, meals, onRemove }: Props) {
  const dayAssignments = assignments.filter(a => a.day === dayIndex);
  const isToday = dayIndex === getTodayIndex();

  return (
    <div className={`day-slot ${isToday ? 'day-slot-today' : ''}`}>
      <h3 className="day-name">{dayName}</h3>

      <Droppable droppableId={`day-${dayIndex}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`day-meals ${snapshot.isDraggingOver ? 'day-meals-active' : ''}`}
          >
            {dayAssignments.map((a, index) => {
              const meal = meals.find(m => m.id === a.mealId);
              if (!meal) return null;
              return (
                <MealChip
                  key={a.id}
                  name={meal.name}
                  assignmentId={a.id}
                  index={index}
                  onRemove={onRemove}
                />
              );
            })}
            {provided.placeholder}
            {dayAssignments.length === 0 && !snapshot.isDraggingOver && (
              <p className="day-empty-hint">drop meals here</p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

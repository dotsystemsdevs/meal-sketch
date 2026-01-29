import { Draggable } from '@hello-pangea/dnd';
import { X } from 'lucide-react';
import { useMemo } from 'react';

type Props = {
  name: string;
  assignmentId: string;
  index: number;
  onRemove: (id: string) => void;
};

export function MealChip({ name, assignmentId, index, onRemove }: Props) {
  const rotation = useMemo(() => {
    return -1.5 + Math.random() * 3;
  }, []);

  return (
    <Draggable draggableId={assignmentId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`meal-chip sticky-note ${snapshot.isDragging ? 'dragging-chip' : ''}`}
          style={{
            transform: snapshot.isDragging ? undefined : `rotate(${rotation}deg)`,
            ...provided.draggableProps.style,
          }}
        >
          <span>{name}</span>
          <button className="meal-chip-remove" onClick={() => onRemove(assignmentId)}>
            <X size={14} />
          </button>
        </div>
      )}
    </Draggable>
  );
}

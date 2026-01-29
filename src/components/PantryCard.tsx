import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, X } from 'lucide-react';
import type { Meal } from '../types';

type Props = {
  meal: Meal;
  remaining: number;
  index: number;
  onEdit: (id: string, name: string, totalPortions: number) => void;
  onDelete: (id: string) => void;
};

export function PantryCard({ meal, remaining, index, onEdit, onDelete }: Props) {
  const isEmpty = remaining <= 0;
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(meal.name);
  const [editPortions, setEditPortions] = useState(meal.totalPortions);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim() && editPortions > 0) {
      onEdit(meal.id, editName.trim(), editPortions);
      setEditing(false);
    }
  };

  return (
    <>
      <Draggable draggableId={meal.id} index={index} isDragDisabled={isEmpty}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`pantry-card sticky-note ${isEmpty ? 'empty' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
            onClick={() => {
              if (!snapshot.isDragging) {
                setEditName(meal.name);
                setEditPortions(meal.totalPortions);
                setEditing(true);
              }
            }}
          >
            <div className="pantry-card-content">
              <span className="pantry-card-name">{meal.name}</span>
              <span className="pantry-card-count">
                {isEmpty ? 'all used up · click to edit' : `${remaining} left · click to edit`}
              </span>
            </div>
            <button className="pantry-card-delete" onClick={(e) => { e.stopPropagation(); onDelete(meal.id); }}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </Draggable>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditing(false)}><X size={18} /></button>
            <h3>Edit Meal</h3>
            <form onSubmit={handleSave}>
              <label>
                Name
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  autoFocus
                />
              </label>
              <label>
                Portions
                <input
                  type="number"
                  value={editPortions}
                  onChange={e => setEditPortions(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                />
              </label>
              <button type="submit" className="btn-primary">Save</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

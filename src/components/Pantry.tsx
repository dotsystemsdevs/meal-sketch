import { useState, useRef } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, Download, Upload } from 'lucide-react';
import type { Meal } from '../types';
import { PantryCard } from './PantryCard';
import { AddMealModal } from './AddMealModal';

type Props = {
  meals: Meal[];
  getRemaining: (mealId: string) => number;
  onAdd: (name: string, portions: number) => void;
  onEdit: (id: string, name: string, totalPortions: number) => void;
  onDelete: (id: string) => void;
  onImportMeals: (presets: { name: string; totalPortions: number }[]) => void;
};

export function Pantry({ meals, getRemaining, onAdd, onEdit, onDelete, onImportMeals }: Props) {
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPresets = () => {
    const presets = meals.map(m => ({ name: m.name, totalPortions: m.totalPortions }));
    const blob = new Blob([JSON.stringify(presets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'meal-presets.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPresets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (Array.isArray(data)) {
          const valid = data.filter(
            (item: unknown): item is { name: string; totalPortions: number } =>
              typeof item === 'object' && item !== null &&
              typeof (item as Record<string, unknown>).name === 'string' &&
              typeof (item as Record<string, unknown>).totalPortions === 'number'
          );
          if (valid.length > 0) onImportMeals(valid);
        }
      } catch { /* invalid JSON */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="pantry">
      <div className="pantry-header">
        <h2>Pantry</h2>
        <div className="pantry-actions">
          {meals.length > 0 && (
            <button className="btn-icon btn-icon-sm" onClick={handleExportPresets} title="Export presets">
              <Download size={15} />
            </button>
          )}
          <button className="btn-icon btn-icon-sm" onClick={() => fileInputRef.current?.click()} title="Import presets">
            <Upload size={15} />
          </button>
          <button className="btn-icon" onClick={() => setShowModal(true)} title="Add meal">
            <Plus size={20} />
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportPresets}
        style={{ display: 'none' }}
      />
      <Droppable droppableId="pantry" isDropDisabled={true}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="pantry-list">
            {meals.map((meal, i) => (
              <PantryCard
                key={meal.id}
                meal={meal}
                remaining={getRemaining(meal.id)}
                index={i}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
            {meals.length === 0 && (
              <p className="pantry-empty">Press + to add a meal or import a preset</p>
            )}
          </div>
        )}
      </Droppable>
      {showModal && <AddMealModal onAdd={onAdd} onClose={() => setShowModal(false)} />}
    </div>
  );
}

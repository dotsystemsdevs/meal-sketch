import { useRef } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Header } from './components/Header';
import { Pantry } from './components/Pantry';
import { Sketchboard } from './components/Sketchboard';
import { useMealPlan } from './hooks/useMealPlan';
import './App.css';

function App() {
  const {
    meals,
    assignments,
    startDay,
    setStartDay,
    addMeal,
    deleteMeal,
    editMeal,
    removeAssignment,
    getRemaining,
    onDragEnd,
    clearWeek,
    importMeals,
  } = useMealPlan();

  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        <Header
          boardRef={boardRef}
          clearWeek={clearWeek}
        />
        <div className="app-layout">
          <Pantry
            meals={meals}
            getRemaining={getRemaining}
            onAdd={addMeal}
            onEdit={editMeal}
            onDelete={deleteMeal}
            onImportMeals={importMeals}
          />
          <div ref={boardRef}>
            <Sketchboard
              assignments={assignments}
              meals={meals}
              startDay={startDay}
              onStartDayChange={setStartDay}
              onRemove={removeAssignment}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;

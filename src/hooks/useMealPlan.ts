import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Meal, Assignment } from '../types';
import { useLocalStorage } from './useLocalStorage';
import type { DropResult } from '@hello-pangea/dnd';

function parseDayId(id: string): number | null {
  const match = id.match(/^day-(\d+)$/);
  if (!match) return null;
  return parseInt(match[1]);
}

export function useMealPlan() {
  const [meals, setMeals] = useLocalStorage<Meal[]>('mealsketch-meals', []);
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('mealsketch-assignments', []);
  const [startDay, setStartDay] = useLocalStorage<number>('mealsketch-startday', 0);

  const addMeal = useCallback((name: string, totalPortions: number) => {
    setMeals(prev => [...prev, { id: uuidv4(), name, totalPortions }]);
  }, [setMeals]);

  const deleteMeal = useCallback((id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    setAssignments(prev => prev.filter(a => a.mealId !== id));
  }, [setMeals, setAssignments]);

  const editMeal = useCallback((id: string, name: string, totalPortions: number) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, name, totalPortions } : m));
  }, [setMeals]);

  const removeAssignment = useCallback((assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  }, [setAssignments]);

  const getRemaining = useCallback((mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return 0;
    const used = assignments.filter(a => a.mealId === mealId).length;
    return meal.totalPortions - used;
  }, [meals, assignments]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || destination.droppableId === 'pantry') return;

    const destDay = parseDayId(destination.droppableId);
    if (destDay === null) return;

    if (source.droppableId === 'pantry') {
      const meal = meals.find(m => m.id === draggableId);
      if (!meal) return;

      const remaining = meal.totalPortions - assignments.filter(a => a.mealId === meal.id).length;
      if (remaining <= 0) return;

      setAssignments(prev => [...prev, {
        id: crypto.randomUUID(),
        mealId: meal.id,
        day: destDay,
      }]);
    } else if (source.droppableId.startsWith('day-')) {
      setAssignments(prev =>
        prev.map(a => a.id === draggableId ? { ...a, day: destDay } : a)
      );
    }
  }, [meals, assignments, setAssignments]);

  const clearWeek = useCallback(() => {
    setAssignments([]);
  }, [setAssignments]);

  const exportState = useCallback(() => {
    return JSON.stringify({ meals, assignments }, null, 2);
  }, [meals, assignments]);

  const importMeals = useCallback((presets: { name: string; totalPortions: number }[]) => {
    setMeals(prev => [
      ...prev,
      ...presets.map(p => ({ id: uuidv4(), name: p.name, totalPortions: p.totalPortions })),
    ]);
  }, [setMeals]);

  const importState = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.meals && data.assignments) {
        setMeals(data.meals);
        setAssignments(data.assignments);
        return true;
      }
    } catch { /* ignore */ }
    return false;
  }, [setMeals, setAssignments]);

  return {
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
    exportState,
    importState,
  };
}

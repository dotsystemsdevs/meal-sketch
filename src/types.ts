export type Meal = {
  id: string;
  name: string;
  totalPortions: number;
};

export type Assignment = {
  id: string;
  mealId: string;
  day: number; // 0=Mon, 1=Tue, ..., 6=Sun
};

export type AppState = {
  meals: Meal[];
  assignments: Assignment[];
};

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

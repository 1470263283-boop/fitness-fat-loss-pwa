export type Gender = 'male' | 'female' | 'other';
export type TrainingDaysPerWeek = 4 | 5;
export type ProgressionType = 'upper_compound' | 'lower_compound' | 'isolation' | 'core' | 'cardio';

export interface NutritionTargets {
  calorieMin: number;
  calorieMax: number;
  proteinMin: number;
  proteinMax: number;
  waterMin: number;
  waterMax: number;
}

export interface UserProfile {
  name: string;
  gender: Gender;
  age: number;
  heightCm: number;
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  trainingDaysPerWeek: TrainingDaysPerWeek;
  targets: NutritionTargets;
  startDate: string;
  profileConfirmed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number;
  notes: string;
  progressionType: ProgressionType;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  weekday: number;
  warmup: string;
  exercises: Exercise[];
  cardio: string;
}

export interface SetLog {
  weightKg: number;
  reps: number;
  rpe: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
}

export interface WorkoutSummary {
  completedExerciseCount: number;
  completedSetCount: number;
  durationMinutes: number;
  highestRpe: number;
  nextAdvice: string[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  planId: string;
  exercises: ExerciseLog[];
  durationMinutes: number;
  notes: string;
  createdAt: string;
  summary?: WorkoutSummary;
}

export interface DailyCheckIn {
  date: string;
  weightKg?: number;
  waistCm?: number;
  caloriesOnTarget?: boolean;
  proteinOnTarget?: boolean;
  waterOnTarget?: boolean;
  creatineTaken?: boolean;
  proteinPowderTaken?: boolean;
  sugaryDrink?: boolean;
  lateSnack?: boolean;
  alcohol?: boolean;
  sleepHours?: number;
  fatigueLevel?: number;
  kneePain?: number;
  backPain?: number;
  shoulderPain?: number;
  notes?: string;
  photoNote?: string;
  updatedAt?: string;
}

export interface FitnessData {
  version: number;
  profile: UserProfile;
  workoutLogs: WorkoutLog[];
  checkIns: DailyCheckIn[];
}

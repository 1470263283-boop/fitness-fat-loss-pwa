import { getPlanById } from '../data/plans';
import type { Exercise, FitnessData, WorkoutLog, WorkoutSummary } from '../types';

const completedSets = (exerciseLog: WorkoutLog['exercises'][number]) =>
  exerciseLog.sets.filter((set) => set.completed);

const averageRpe = (exerciseLog: WorkoutLog['exercises'][number]) => {
  const sets = completedSets(exerciseLog).filter((set) => set.rpe > 0);
  if (!sets.length) return 0;
  return sets.reduce((sum, set) => sum + set.rpe, 0) / sets.length;
};

const meetsTopReps = (exercise: Exercise, exerciseLog: WorkoutLog['exercises'][number]) => {
  const sets = completedSets(exerciseLog);
  if (sets.length < exercise.targetSets) return false;
  return sets.slice(0, exercise.targetSets).every((set) => set.reps >= exercise.targetRepsMax);
};

const missesMinReps = (exercise: Exercise, exerciseLog: WorkoutLog['exercises'][number]) => {
  const sets = completedSets(exerciseLog);
  if (sets.length < exercise.targetSets) return true;
  return sets.slice(0, exercise.targetSets).some((set) => set.reps < exercise.targetRepsMin);
};

export const getExerciseHistory = (data: FitnessData, exerciseId: string, beforeDate?: string) =>
  data.workoutLogs
    .filter((log) => !beforeDate || log.date <= beforeDate)
    .map((log) => ({
      workout: log,
      exerciseLog: log.exercises.find((exercise) => exercise.exerciseId === exerciseId),
    }))
    .filter((item): item is { workout: WorkoutLog; exerciseLog: WorkoutLog['exercises'][number] } =>
      Boolean(item.exerciseLog),
    )
    .sort((a, b) => b.workout.date.localeCompare(a.workout.date) || b.workout.createdAt.localeCompare(a.workout.createdAt));

export const getProgressionAdvice = (data: FitnessData, exercise: Exercise, beforeDate?: string) => {
  if (exercise.progressionType === 'cardio' || exercise.progressionType === 'core') {
    return '核心/有氧优先保持动作质量和时长稳定，再逐步增加时长或难度。';
  }

  const history = getExerciseHistory(data, exercise.id, beforeDate);
  const last = history[0]?.exerciseLog;
  if (!last) return '暂无历史记录，先用能稳定完成目标次数的重量建立基准。';

  const highestRpe = Math.max(...last.sets.map((set) => set.rpe || 0));
  if (highestRpe >= 9) return '上次RPE>=9，下次维持重量，不加重量。';

  const lastTwo = history.slice(0, 2);
  if (lastTwo.length >= 2 && lastTwo.every((item) => meetsTopReps(exercise, item.exerciseLog) && averageRpe(item.exerciseLog) <= 8)) {
    if (exercise.progressionType === 'upper_compound') return '连续两次完成最高次数且RPE<=8，下次建议加2.5-5kg。';
    if (exercise.progressionType === 'lower_compound') return '连续两次完成最高次数且RPE<=8，下次建议加5-10kg。';
    return '连续两次完成最高次数且RPE<=8，孤立动作先增加次数或加一档小重量。';
  }

  if (lastTwo.length >= 2 && lastTwo.every((item) => missesMinReps(exercise, item.exerciseLog))) {
    return '连续两次未完成目标最低次数，下次建议下调5%-10%重量。';
  }

  return '继续保持当前重量，优先把动作质量和目标次数做稳。';
};

export const summarizeWorkout = (log: WorkoutLog, data: FitnessData): WorkoutSummary => {
  const completedExerciseCount = log.exercises.filter((exercise) => completedSets(exercise).length > 0).length;
  const completedSetCount = log.exercises.reduce((sum, exercise) => sum + completedSets(exercise).length, 0);
  const highestRpe = Math.max(0, ...log.exercises.flatMap((exercise) => exercise.sets.map((set) => set.rpe || 0)));
  const plan = getPlanById(log.planId);
  const nextAdvice =
    plan?.exercises
      .slice(0, 5)
      .map((exercise) => `${exercise.name}：${getProgressionAdvice(data, exercise, log.date)}`) ?? [];

  return {
    completedExerciseCount,
    completedSetCount,
    durationMinutes: log.durationMinutes,
    highestRpe,
    nextAdvice,
  };
};

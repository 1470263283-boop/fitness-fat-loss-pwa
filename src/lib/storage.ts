import type { FitnessData, UserProfile } from '../types';
import { todayKey } from './date';

export const STORAGE_KEY = 'fitness-fat-loss-pwa:data:v1';

export const defaultProfile = (): UserProfile => ({
  name: '我',
  gender: 'male',
  age: 25,
  heightCm: 177,
  startWeightKg: 91,
  currentWeightKg: 91,
  targetWeightKg: 78,
  trainingDaysPerWeek: 5,
  targets: {
    calorieMin: 2200,
    calorieMax: 2300,
    proteinMin: 150,
    proteinMax: 180,
    waterMin: 2.5,
    waterMax: 3.5,
  },
  startDate: todayKey(),
  profileConfirmed: false,
});

export const defaultData = (): FitnessData => ({
  version: 1,
  profile: defaultProfile(),
  workoutLogs: [],
  checkIns: [],
});

export const normalizeData = (raw: unknown): FitnessData => {
  const fallback = defaultData();
  if (!raw || typeof raw !== 'object') return fallback;
  const incoming = raw as Partial<FitnessData>;
  const profile = {
    ...fallback.profile,
    ...(incoming.profile ?? {}),
    targets: {
      ...fallback.profile.targets,
      ...(incoming.profile?.targets ?? {}),
    },
  };

  return {
    version: 1,
    profile,
    workoutLogs: Array.isArray(incoming.workoutLogs) ? incoming.workoutLogs : [],
    checkIns: Array.isArray(incoming.checkIns) ? incoming.checkIns : [],
  };
};

export const loadFitnessData = (): FitnessData => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultData();
    return normalizeData(JSON.parse(saved));
  } catch {
    return defaultData();
  }
};

export const saveFitnessData = (data: FitnessData) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

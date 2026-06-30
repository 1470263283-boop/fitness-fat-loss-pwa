import { getDateRange, getProgramStage, getProgramWeek, todayKey } from './date';
import type { DailyCheckIn, FitnessData } from '../types';

export const getCheckIn = (data: FitnessData, date = todayKey()) =>
  data.checkIns.find((item) => item.date === date);

export const getWeightEntries = (data: FitnessData) =>
  data.checkIns
    .filter((item) => typeof item.weightKg === 'number')
    .map((item) => ({ date: item.date, weightKg: item.weightKg as number }))
    .sort((a, b) => a.date.localeCompare(b.date));

export const getWaistEntries = (data: FitnessData) =>
  data.checkIns
    .filter((item) => typeof item.waistCm === 'number')
    .map((item) => ({ date: item.date, waistCm: item.waistCm as number }))
    .sort((a, b) => a.date.localeCompare(b.date));

export const getSevenDayAverageWeight = (data: FitnessData, date = todayKey()) => {
  const days = new Set(getDateRange(7, date));
  const entries = getWeightEntries(data).filter((item) => days.has(item.date));
  if (entries.length < 3) return null;
  const total = entries.reduce((sum, item) => sum + item.weightKg, 0);
  return Number((total / entries.length).toFixed(1));
};

export const getRecent30DayWeightChange = (data: FitnessData, date = todayKey()) => {
  const days = new Set(getDateRange(30, date));
  const entries = getWeightEntries(data).filter((item) => days.has(item.date));
  if (entries.length < 2) return null;
  const first = entries[0];
  const last = entries[entries.length - 1];
  return {
    first,
    last,
    delta: Number((last.weightKg - first.weightKg).toFixed(1)),
  };
};

export const getTargetStage = (weightKg: number) => {
  if (weightKg > 86) return '91kg -> 86kg';
  if (weightKg > 82) return '86kg -> 82kg';
  if (weightKg > 78) return '82kg -> 78kg';
  return '78kg目标维持';
};

export const getCurrentStage = (data: FitnessData, date = todayKey()) => {
  const week = getProgramWeek(data.profile.startDate, date);
  return {
    week,
    label: getProgramStage(week),
  };
};

export const getConsecutiveFatigueDays = (checkIns: DailyCheckIn[], endDate = todayKey()) => {
  const byDate = new Map(checkIns.map((item) => [item.date, item]));
  let count = 0;
  for (const date of getDateRange(14, endDate).reverse()) {
    const record = byDate.get(date);
    if ((record?.fatigueLevel ?? 0) >= 4) count += 1;
    else break;
  }
  return count;
};

export const hasNutritionData = (record: DailyCheckIn) =>
  [
    record.caloriesOnTarget,
    record.proteinOnTarget,
    record.waterOnTarget,
    record.creatineTaken,
    record.proteinPowderTaken,
    record.sugaryDrink,
    record.lateSnack,
    record.alcohol,
  ].some((value) => typeof value === 'boolean') || Boolean(record.notes);

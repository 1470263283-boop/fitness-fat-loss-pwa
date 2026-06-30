import { useEffect, useState } from 'react';
import type { DailyCheckIn, FitnessData, UserProfile, WorkoutLog } from '../types';
import { defaultData, loadFitnessData, normalizeData, saveFitnessData } from '../lib/storage';
import { todayKey } from '../lib/date';

const makeId = () => {
  if ('crypto' in window && 'randomUUID' in window.crypto) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useFitnessData = () => {
  const [data, setData] = useState<FitnessData>(() => loadFitnessData());

  useEffect(() => {
    saveFitnessData(data);
  }, [data]);

  const upsertCheckIn = (patch: Partial<DailyCheckIn> & { date?: string }) => {
    const date = patch.date ?? todayKey();
    setData((current) => {
      const existing = current.checkIns.find((item) => item.date === date);
      const nextRecord: DailyCheckIn = {
        ...(existing ?? { date }),
        ...patch,
        date,
        updatedAt: new Date().toISOString(),
      };
      const checkIns = existing
        ? current.checkIns.map((item) => (item.date === date ? nextRecord : item))
        : [...current.checkIns, nextRecord];
      return { ...current, checkIns };
    });
  };

  const saveWorkoutLog = (log: Omit<WorkoutLog, 'id' | 'createdAt'>) => {
    const nextLog: WorkoutLog = {
      ...log,
      id: makeId(),
      createdAt: new Date().toISOString(),
    };
    setData((current) => ({ ...current, workoutLogs: [nextLog, ...current.workoutLogs] }));
    return nextLog;
  };

  const deleteWorkoutLog = (id: string) => {
    setData((current) => ({
      ...current,
      workoutLogs: current.workoutLogs.filter((log) => log.id !== id),
    }));
  };

  const deleteCheckIn = (date: string) => {
    setData((current) => ({
      ...current,
      checkIns: current.checkIns.filter((record) => record.date !== date),
    }));
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    setData((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
  };

  const replaceAllData = (raw: unknown) => {
    setData(normalizeData(raw));
  };

  const resetAllData = () => {
    setData(defaultData());
  };

  return {
    data,
    setData,
    upsertCheckIn,
    saveWorkoutLog,
    deleteWorkoutLog,
    deleteCheckIn,
    updateProfile,
    replaceAllData,
    resetAllData,
  };
};

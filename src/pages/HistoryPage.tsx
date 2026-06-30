import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { SegmentedControl } from '../components/Controls';
import { EmptyState } from '../components/EmptyState';
import { allExercises, getPlanById } from '../data/plans';
import { formatDateCn } from '../lib/date';
import { getExerciseHistory } from '../lib/progression';
import { getWaistEntries, getWeightEntries, hasNutritionData } from '../lib/stats';
import type { FitnessData } from '../types';

type HistoryTab = 'workouts' | 'exercise' | 'nutrition' | 'body';

interface HistoryPageProps {
  data: FitnessData;
  deleteWorkoutLog: (id: string) => void;
  deleteCheckIn: (date: string) => void;
}

export default function HistoryPage({ data, deleteWorkoutLog, deleteCheckIn }: HistoryPageProps) {
  const [tab, setTab] = useState<HistoryTab>('workouts');
  const [dateFilter, setDateFilter] = useState('');
  const [exerciseId, setExerciseId] = useState(allExercises[0]?.id ?? '');

  const workouts = useMemo(
    () =>
      data.workoutLogs
        .filter((log) => !dateFilter || log.date === dateFilter)
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    [data.workoutLogs, dateFilter],
  );

  const exerciseHistory = getExerciseHistory(data, exerciseId);
  const nutritionRecords = data.checkIns.filter(hasNutritionData).sort((a, b) => b.date.localeCompare(a.date));
  const weightEntries = getWeightEntries(data).reverse();
  const waistEntries = getWaistEntries(data).reverse();

  const confirmDeleteWorkout = (id: string) => {
    if (window.confirm('确认删除这条训练记录？删除后无法恢复。')) deleteWorkoutLog(id);
  };

  const confirmDeleteCheckIn = (date: string) => {
    if (window.confirm('确认删除这一天的所有体重、饮食和恢复记录？删除后无法恢复。')) deleteCheckIn(date);
  };

  return (
    <>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'workouts', label: '训练' },
          { value: 'exercise', label: '动作' },
          { value: 'nutrition', label: '饮食' },
          { value: 'body', label: '体重' },
        ]}
      />

      {tab === 'workouts' && (
        <Card title="训练记录">
          <label className="field">
            <span>按日期筛选</span>
            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
          </label>
          {workouts.length ? (
            <div className="history-list">
              {workouts.map((log) => {
                const plan = getPlanById(log.planId);
                return (
                  <article key={log.id} className="history-item">
                    <div>
                      <strong>{formatDateCn(log.date)} · {plan?.name ?? log.planId}</strong>
                      <small>
                        {log.summary?.completedExerciseCount ?? log.exercises.length}个动作 / {log.summary?.completedSetCount ?? 0}组 / {log.durationMinutes}分钟
                      </small>
                      {log.notes && <p>{log.notes}</p>}
                    </div>
                    <button type="button" className="icon-button danger" onClick={() => confirmDeleteWorkout(log.id)} aria-label="删除训练记录">
                      <Trash2 size={18} />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState text="还没有训练记录，完成一次训练后这里会显示历史。" />
          )}
        </Card>
      )}

      {tab === 'exercise' && (
        <Card title="动作重量变化">
          <label className="field">
            <span>选择动作</span>
            <select value={exerciseId} onChange={(event) => setExerciseId(event.target.value)}>
              {allExercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </label>
          {exerciseHistory.length ? (
            <div className="history-list">
              {exerciseHistory.map(({ workout, exerciseLog }) => {
                const completed = exerciseLog.sets.filter((set) => set.completed);
                const maxWeight = Math.max(0, ...completed.map((set) => set.weightKg));
                const maxReps = Math.max(0, ...completed.map((set) => set.reps));
                return (
                  <article key={`${workout.id}-${exerciseLog.exerciseId}`} className="history-item">
                    <div>
                      <strong>{formatDateCn(workout.date)}</strong>
                      <small>
                        最高重量 {maxWeight}kg / 最高次数 {maxReps} / 完成{completed.length}组
                      </small>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState text="这个动作还没有训练记录。" />
          )}
        </Card>
      )}

      {tab === 'nutrition' && (
        <Card title="饮食打卡历史">
          {nutritionRecords.length ? (
            <div className="history-list">
              {nutritionRecords.map((record) => (
                <article key={record.date} className="history-item">
                  <div>
                    <strong>{formatDateCn(record.date)}</strong>
                    <small>
                      热量{record.caloriesOnTarget ? '达标' : '未记'} · 蛋白{record.proteinOnTarget ? '达标' : '未记'} · 饮水{record.waterOnTarget ? '达标' : '未记'}
                    </small>
                    {record.notes && <p>{record.notes}</p>}
                  </div>
                  <button type="button" className="icon-button danger" onClick={() => confirmDeleteCheckIn(record.date)} aria-label="删除这天记录">
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState text="还没有饮食打卡历史。" />
          )}
        </Card>
      )}

      {tab === 'body' && (
        <>
          <Card title="体重历史">
            {weightEntries.length ? (
              <div className="compact-list">
                {weightEntries.map((item) => (
                  <span key={item.date}>
                    {formatDateCn(item.date)} <strong>{item.weightKg}kg</strong>
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState text="还没有体重记录。" />
            )}
          </Card>
          <Card title="腰围历史">
            {waistEntries.length ? (
              <div className="compact-list">
                {waistEntries.map((item) => (
                  <span key={item.date}>
                    {formatDateCn(item.date)} <strong>{item.waistCm}cm</strong>
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState text="还没有腰围记录。" />
            )}
          </Card>
        </>
      )}
    </>
  );
}

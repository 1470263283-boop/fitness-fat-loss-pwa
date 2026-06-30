import { useEffect, useMemo, useState } from 'react';
import { Check, ClipboardCopy, Save } from 'lucide-react';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { getPlanById, getPlanForWeekday, workoutPlans } from '../data/plans';
import { getWeekday, todayKey } from '../lib/date';
import { getExerciseHistory, getProgressionAdvice, summarizeWorkout } from '../lib/progression';
import type { Exercise, ExerciseLog, FitnessData, SetLog, WorkoutLog, WorkoutSummary } from '../types';

interface WorkoutPageProps {
  data: FitnessData;
  saveWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'createdAt'>) => WorkoutLog;
}

const emptySet = (): SetLog => ({ weightKg: 0, reps: 0, rpe: 0, completed: false });

const buildExerciseLogs = (planId: string): ExerciseLog[] => {
  const plan = getPlanById(planId);
  if (!plan) return [];
  return plan.exercises.map((exercise) => ({
    exerciseId: exercise.id,
    sets: Array.from({ length: exercise.targetSets }, () => emptySet()),
  }));
};

const displayValue = (value: number) => (value === 0 ? '' : value);

export default function WorkoutPage({ data, saveWorkoutLog }: WorkoutPageProps) {
  const defaultPlanId = getPlanForWeekday(getWeekday())?.id ?? 'upper-a';
  const [planId, setPlanId] = useState(defaultPlanId);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() => buildExerciseLogs(defaultPlanId));
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState<WorkoutSummary | null>(null);
  const today = todayKey();
  const plan = useMemo(() => getPlanById(planId), [planId]);

  useEffect(() => {
    setExerciseLogs(buildExerciseLogs(planId));
    setSummary(null);
  }, [planId]);

  const updateSet = (exerciseId: string, setIndex: number, patch: Partial<SetLog>) => {
    setExerciseLogs((current) =>
      current.map((exerciseLog) =>
        exerciseLog.exerciseId === exerciseId
          ? {
              ...exerciseLog,
              sets: exerciseLog.sets.map((set, index) => (index === setIndex ? { ...set, ...patch } : set)),
            }
          : exerciseLog,
      ),
    );
  };

  const completeSet = (exercise: Exercise, setIndex: number) => {
    const currentLog = exerciseLogs.find((item) => item.exerciseId === exercise.id);
    const currentSet = currentLog?.sets[setIndex] ?? emptySet();
    updateSet(exercise.id, setIndex, {
      reps: currentSet.reps || exercise.targetRepsMax,
      rpe: currentSet.rpe || 8,
      completed: true,
    });
  };

  const copyPreviousWeights = (exercise: Exercise) => {
    const previous = getExerciseHistory(data, exercise.id)[0]?.exerciseLog;
    if (!previous) return;
    setExerciseLogs((current) =>
      current.map((exerciseLog) => {
        if (exerciseLog.exerciseId !== exercise.id) return exerciseLog;
        return {
          ...exerciseLog,
          sets: exerciseLog.sets.map((set, index) => ({
            ...set,
            weightKg: previous.sets[index]?.weightKg ?? previous.sets[0]?.weightKg ?? set.weightKg,
          })),
        };
      }),
    );
  };

  const saveWorkout = () => {
    if (!plan) return;
    const tempLog: WorkoutLog = {
      id: 'preview',
      createdAt: new Date().toISOString(),
      date: today,
      planId: plan.id,
      exercises: exerciseLogs,
      durationMinutes,
      notes,
    };
    const dataWithCurrent = { ...data, workoutLogs: [tempLog, ...data.workoutLogs] };
    const nextSummary = summarizeWorkout(tempLog, dataWithCurrent);
    saveWorkoutLog({ ...tempLog, summary: nextSummary });
    setSummary(nextSummary);
  };

  if (!plan) {
    return <EmptyState text="没有找到训练计划，请在设置中检查数据。" />;
  }

  return (
    <>
      <Card title="选择训练日">
        <div className="plan-selector">
          {workoutPlans.map((item) => (
            <button key={item.id} type="button" className={item.id === planId ? 'selected' : ''} onClick={() => setPlanId(item.id)}>
              {item.name}
            </button>
          ))}
        </div>
      </Card>

      <Card title={plan.name} eyebrow="今日训练">
        <div className="plan-meta">
          <p>
            <strong>热身</strong>
            {plan.warmup}
          </p>
          <p>
            <strong>有氧</strong>
            {plan.cardio}
          </p>
        </div>
      </Card>

      {plan.exercises.map((exercise, index) => {
        const exerciseLog = exerciseLogs.find((item) => item.exerciseId === exercise.id);
        const advice = getProgressionAdvice(data, exercise);
        return (
          <details key={`${exercise.id}-${index}`} className="workout-exercise" open={index === 0}>
            <summary>
              <div>
                <strong>{exercise.name}</strong>
                <span>
                  {exercise.targetSets}组 x {exercise.targetRepsMin}-{exercise.targetRepsMax}次
                </span>
              </div>
            </summary>
            <div className="exercise-detail">
              <p className="support-text">{exercise.notes}</p>
              <p className="advice-text">{advice}</p>
              <button type="button" className="ghost-button" onClick={() => copyPreviousWeights(exercise)}>
                <ClipboardCopy size={16} />
                复制上次重量
              </button>

              <div className="set-grid">
                {exerciseLog?.sets.map((set, setIndex) => (
                  <div key={`${exercise.id}-${setIndex}`} className="set-row">
                    <span className="set-index">第{setIndex + 1}组</span>
                    <label>
                      重量/阻力
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.5"
                        value={displayValue(set.weightKg)}
                        onChange={(event) => updateSet(exercise.id, setIndex, { weightKg: Number(event.target.value) })}
                      />
                    </label>
                    <label>
                      次数
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={displayValue(set.reps)}
                        onChange={(event) => updateSet(exercise.id, setIndex, { reps: Number(event.target.value) })}
                      />
                    </label>
                    <label>
                      RPE
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="10"
                        step="0.5"
                        value={displayValue(set.rpe)}
                        onChange={(event) => updateSet(exercise.id, setIndex, { rpe: Number(event.target.value) })}
                      />
                    </label>
                    <button
                      type="button"
                      className={set.completed ? 'small-button done' : 'small-button'}
                      onClick={() => completeSet(exercise, setIndex)}
                    >
                      <Check size={15} />
                      {set.completed ? '已完成' : '完成'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </details>
        );
      })}

      <Card title="训练备注">
        <label className="field">
          <span>训练时长</span>
          <div className="input-with-suffix">
            <input type="number" min="1" max="240" value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} />
            <small>分钟</small>
          </div>
        </label>
        <label className="field">
          <span>备注</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="例如：状态、疼痛、动作感受" />
        </label>
        <button type="button" className="primary-button full" onClick={saveWorkout}>
          <Save size={18} />
          保存本次训练
        </button>
      </Card>

      {summary && (
        <Card title="本次训练总结">
          <div className="summary-grid">
            <span>
              完成动作<strong>{summary.completedExerciseCount}</strong>
            </span>
            <span>
              完成组数<strong>{summary.completedSetCount}</strong>
            </span>
            <span>
              训练时长<strong>{summary.durationMinutes}分钟</strong>
            </span>
            <span>
              最高RPE<strong>{summary.highestRpe}</strong>
            </span>
          </div>
          <ul className="plain-list">
            {summary.nextAdvice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

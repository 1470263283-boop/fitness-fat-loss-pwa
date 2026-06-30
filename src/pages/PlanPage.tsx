import { CalendarDays } from 'lucide-react';
import { Card } from '../components/Card';
import { weeklySchedule, workoutPlans } from '../data/plans';
import type { FitnessData } from '../types';

export default function PlanPage({ data }: { data: FitnessData }) {
  return (
    <>
      <Card title="每周安排" action={<CalendarDays size={20} />}>
        <div className="schedule-list">
          {weeklySchedule.map((item) => (
            <div key={item.label} className="schedule-item">
              <span>{item.label}</span>
              <strong>{data.profile.trainingDaysPerWeek === 4 && item.planId === 'cardio-shaping' ? '可选有氧塑型日' : item.name}</strong>
            </div>
          ))}
        </div>
      </Card>

      {workoutPlans.map((plan) => (
        <Card key={plan.id} eyebrow={weeklySchedule.find((item) => item.planId === plan.id)?.label} title={plan.name}>
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
          <div className="exercise-list">
            {plan.exercises.map((exercise, index) => (
              <div key={`${plan.id}-${exercise.id}-${index}`} className="exercise-row">
                <span>{index + 1}</span>
                <div>
                  <strong>{exercise.name}</strong>
                  <small>
                    {exercise.targetSets}组 / {exercise.targetRepsMin}-{exercise.targetRepsMax}次 / 休息{exercise.restSeconds || '按需'}秒
                  </small>
                  <em>{exercise.notes}</em>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </>
  );
}

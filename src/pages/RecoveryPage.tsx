import { useState } from 'react';
import { AlertTriangle, Save } from 'lucide-react';
import { Card } from '../components/Card';
import { NumberField } from '../components/Controls';
import { getCurrentStage, getCheckIn, getConsecutiveFatigueDays } from '../lib/stats';
import { todayKey } from '../lib/date';
import type { DailyCheckIn, FitnessData } from '../types';

interface RecoveryPageProps {
  data: FitnessData;
  upsertCheckIn: (patch: Partial<DailyCheckIn> & { date?: string }) => void;
}

const levelOptions = [1, 2, 3, 4, 5];

function RatingButtons({ value, onChange }: { value: number | ''; onChange: (value: number) => void }) {
  return (
    <div className="rating-buttons">
      {levelOptions.map((level) => (
        <button key={level} type="button" className={value === level ? 'selected' : ''} onClick={() => onChange(level)}>
          {level}
        </button>
      ))}
    </div>
  );
}

export default function RecoveryPage({ data, upsertCheckIn }: RecoveryPageProps) {
  const today = todayKey();
  const record = getCheckIn(data, today);
  const [sleepHours, setSleepHours] = useState<number | ''>(record?.sleepHours ?? '');
  const [fatigueLevel, setFatigueLevel] = useState<number | ''>(record?.fatigueLevel ?? '');
  const [kneePain, setKneePain] = useState<number | ''>(record?.kneePain ?? '');
  const [backPain, setBackPain] = useState<number | ''>(record?.backPain ?? '');
  const [shoulderPain, setShoulderPain] = useState<number | ''>(record?.shoulderPain ?? '');
  const [notes, setNotes] = useState(record?.notes ?? '');
  const stage = getCurrentStage(data, today);
  const fatigueStreak = getConsecutiveFatigueDays(data.checkIns, today);

  const alerts: string[] = [];
  const painMap = [
    ['膝盖', kneePain],
    ['腰部', backPain],
    ['肩部', shoulderPain],
  ] as const;

  painMap.forEach(([label, value]) => {
    if (value !== '' && value >= 6) alerts.push(`${label}疼痛>=6：停止相关动作，改低冲击有氧，必要时就医。`);
    else if (value !== '' && value >= 4) alerts.push(`${label}疼痛>=4：降低相关动作强度和训练量。`);
  });
  if (fatigueStreak >= 3) alerts.push('连续3天疲劳>=4：建议安排休息或减少有氧。');
  if (stage.week === 11) alerts.push('第11周减量恢复周：重量下降10-20%，组数减少约30%。');

  const saveRecovery = () => {
    upsertCheckIn({
      date: today,
      sleepHours: sleepHours === '' ? undefined : sleepHours,
      fatigueLevel: fatigueLevel === '' ? undefined : fatigueLevel,
      kneePain: kneePain === '' ? undefined : kneePain,
      backPain: backPain === '' ? undefined : backPain,
      shoulderPain: shoulderPain === '' ? undefined : shoulderPain,
      notes,
    });
  };

  return (
    <>
      <Card title="今日恢复">
        <NumberField label="睡眠" value={sleepHours} onChange={setSleepHours} min={0} max={14} step={0.5} suffix="小时" />
        <div className="field">
          <span>疲劳程度 1-5</span>
          <RatingButtons value={fatigueLevel} onChange={setFatigueLevel} />
        </div>
        <div className="two-col">
          <NumberField label="膝盖疼痛" value={kneePain} onChange={setKneePain} min={0} max={10} step={1} suffix="/10" />
          <NumberField label="腰部疼痛" value={backPain} onChange={setBackPain} min={0} max={10} step={1} suffix="/10" />
        </div>
        <NumberField label="肩部疼痛" value={shoulderPain} onChange={setShoulderPain} min={0} max={10} step={1} suffix="/10" />
        <label className="field">
          <span>精神状态备注</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="例如：压力、精神、疼痛位置" />
        </label>
        <button type="button" className="primary-button full" onClick={saveRecovery}>
          <Save size={18} />
          保存恢复记录
        </button>
      </Card>

      <Card title="恢复提示" action={<AlertTriangle size={20} />}>
        {alerts.length ? (
          <ul className="alert-list">
            {alerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}
          </ul>
        ) : (
          <p className="support-text">当前没有触发疼痛或疲劳提醒。训练时仍以动作质量和疼痛反馈为先。</p>
        )}
      </Card>
    </>
  );
}

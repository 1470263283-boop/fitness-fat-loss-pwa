import { useMemo, useState } from 'react';
import { Camera, Scale } from 'lucide-react';
import { Card } from '../components/Card';
import { NumberField } from '../components/Controls';
import { EmptyState } from '../components/EmptyState';
import { LineChart } from '../components/LineChart';
import { formatDateCn, getDateRange, todayKey } from '../lib/date';
import {
  getCheckIn,
  getCurrentStage,
  getRecent30DayWeightChange,
  getSevenDayAverageWeight,
  getTargetStage,
  getWaistEntries,
  getWeightEntries,
} from '../lib/stats';
import type { DailyCheckIn, FitnessData } from '../types';

interface ProgressPageProps {
  data: FitnessData;
  upsertCheckIn: (patch: Partial<DailyCheckIn> & { date?: string }) => void;
}

export default function ProgressPage({ data, upsertCheckIn }: ProgressPageProps) {
  const today = todayKey();
  const current = getCheckIn(data, today);
  const [weight, setWeight] = useState<number | ''>(current?.weightKg ?? '');
  const [waist, setWaist] = useState<number | ''>(current?.waistCm ?? '');
  const [photoNote, setPhotoNote] = useState(current?.photoNote ?? '');
  const sevenDayAverage = getSevenDayAverageWeight(data, today);
  const recentChange = getRecent30DayWeightChange(data, today);
  const stage = getCurrentStage(data, today);
  const weightEntries = getWeightEntries(data);
  const waistEntries = getWaistEntries(data);

  const recentWeights = useMemo(() => {
    const range = new Set(getDateRange(30, today));
    return weightEntries.filter((item) => range.has(item.date));
  }, [today, weightEntries]);

  const saveProgress = () => {
    upsertCheckIn({
      date: today,
      weightKg: weight === '' ? undefined : weight,
      waistCm: waist === '' ? undefined : waist,
      photoNote,
    });
  };

  const currentWeight = sevenDayAverage ?? weightEntries.at(-1)?.weightKg ?? data.profile.currentWeightKg;
  const photoReminder = stage.week % 4 === 0 ? '本周建议拍正面、侧面、背面照片。' : `建议每4周拍照复盘，当前第${stage.week}周。`;

  return (
    <>
      <Card title="今日进度" action={<Scale size={20} />}>
        <div className="two-col">
          <NumberField label="体重" value={weight} onChange={setWeight} min={30} max={250} step={0.1} suffix="kg" />
          <NumberField label="腰围" value={waist} onChange={setWaist} min={40} max={180} step={0.1} suffix="cm" />
        </div>
        <label className="field">
          <span>体型照片备注</span>
          <textarea value={photoNote} onChange={(event) => setPhotoNote(event.target.value)} placeholder="先记录提醒或照片保存位置即可" />
        </label>
        <button type="button" className="primary-button full" onClick={saveProgress}>
          保存进度
        </button>
      </Card>

      <div className="metric-grid">
        <div className="metric">
          <span>7日均重</span>
          <strong>{sevenDayAverage ? `${sevenDayAverage}kg` : '继续记录'}</strong>
        </div>
        <div className="metric">
          <span>30天变化</span>
          <strong>{recentChange ? `${recentChange.delta > 0 ? '+' : ''}${recentChange.delta}kg` : '暂无'}</strong>
        </div>
        <div className="metric">
          <span>阶段</span>
          <strong>{stage.label}</strong>
        </div>
        <div className="metric">
          <span>目标段</span>
          <strong>{getTargetStage(currentWeight)}</strong>
        </div>
      </div>

      <Card title="体重趋势">
        <LineChart data={recentWeights.map((item) => ({ date: item.date, value: item.weightKg }))} />
        {recentWeights.length > 0 ? (
          <div className="compact-list">
            {recentWeights.slice(-8).reverse().map((item) => (
              <span key={item.date}>
                {formatDateCn(item.date)} <strong>{item.weightKg}kg</strong>
              </span>
            ))}
          </div>
        ) : (
          <EmptyState text="还没有体重记录，录入一次后这里会显示趋势。" />
        )}
      </Card>

      <Card title="腰围变化">
        {waistEntries.length ? (
          <div className="compact-list">
            {waistEntries.slice(-8).reverse().map((item) => (
              <span key={item.date}>
                {formatDateCn(item.date)} <strong>{item.waistCm}cm</strong>
              </span>
            ))}
          </div>
        ) : (
          <EmptyState text="还没有腰围记录，建议每2周记录一次。" />
        )}
      </Card>

      <Card title="阶段目标">
        <div className="goal-ladder">
          {['91kg', '86kg', '82kg', '78kg'].map((goal) => (
            <span key={goal} className={Number(goal.replace('kg', '')) >= currentWeight ? 'done' : ''}>
              {goal}
            </span>
          ))}
        </div>
        <p className="photo-reminder">
          <Camera size={16} />
          {photoReminder}
        </p>
      </Card>
    </>
  );
}

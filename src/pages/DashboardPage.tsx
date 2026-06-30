import { useMemo, useState } from 'react';
import { CheckCircle2, Droplets, Dumbbell, Scale, Target } from 'lucide-react';
import type { RouteKey } from '../App';
import { Card } from '../components/Card';
import { NumberField, ToggleButton } from '../components/Controls';
import { getPlanForWeekday } from '../data/plans';
import { formatDateCn, getWeekday, todayKey } from '../lib/date';
import { getCheckIn, getCurrentStage, getSevenDayAverageWeight, getTargetStage, getWeightEntries } from '../lib/stats';
import type { DailyCheckIn, FitnessData, UserProfile } from '../types';

interface DashboardPageProps {
  data: FitnessData;
  upsertCheckIn: (patch: Partial<DailyCheckIn> & { date?: string }) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  onNavigate: (route: RouteKey) => void;
  onOpenSettings: () => void;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="metric">
      <span className="metric-icon">{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function DashboardPage({ data, upsertCheckIn, updateProfile, onNavigate, onOpenSettings }: DashboardPageProps) {
  const today = todayKey();
  const weekday = getWeekday(today);
  const plan = getPlanForWeekday(weekday);
  const todayRecord = getCheckIn(data, today);
  const stage = getCurrentStage(data, today);
  const sevenDayAvg = getSevenDayAverageWeight(data, today);
  const latestWeight = getWeightEntries(data).at(-1)?.weightKg ?? data.profile.currentWeightKg;
  const currentWeight = sevenDayAvg ?? latestWeight;
  const doneToday = Boolean(plan && data.workoutLogs.some((log) => log.date === today && log.planId === plan.id));
  const [weightInput, setWeightInput] = useState<number | ''>(todayRecord?.weightKg ?? '');

  const completionCount = useMemo(() => {
    const checks = [
      todayRecord?.waterOnTarget,
      todayRecord?.creatineTaken,
      todayRecord?.proteinPowderTaken,
      todayRecord?.proteinOnTarget,
    ];
    return checks.filter(Boolean).length;
  }, [todayRecord]);

  const saveWeight = () => {
    if (weightInput === '') return;
    upsertCheckIn({ date: today, weightKg: weightInput });
  };

  return (
    <>
      {!data.profile.profileConfirmed && (
        <Card title="首次使用确认">
          <p className="support-text">
            当前已按你的基础信息初始化：{data.profile.age}岁，{data.profile.heightCm}cm，起始体重{data.profile.startWeightKg}kg。正式使用前建议确认一次，后续可随时在设置中修改。
          </p>
          <div className="button-row top-gap">
            <button type="button" className="secondary-button" onClick={onOpenSettings}>
              修改信息
            </button>
            <button type="button" className="primary-button" onClick={() => updateProfile({ profileConfirmed: true })}>
              确认使用
            </button>
          </div>
        </Card>
      )}

      <Card eyebrow={formatDateCn(today)} title={plan ? `今日：${plan.name}` : '今日：休息日'}>
        <div className="hero-panel">
          <div>
            <p>{plan ? `${plan.warmup}，力量动作${plan.exercises.length}个。` : '今天安排恢复和轻活动，保持饮水与睡眠。'}</p>
            {plan && <small>有氧：{plan.cardio}</small>}
          </div>
          <button type="button" className="primary-button" onClick={() => onNavigate('training')}>
            <Dumbbell size={18} />
            去训练
          </button>
        </div>
      </Card>

      <div className="metric-grid">
        <Metric icon={<CheckCircle2 size={18} />} label="训练状态" value={doneToday ? '已完成' : plan ? '未完成' : '休息'} />
        <Metric icon={<Scale size={18} />} label="7日均重" value={sevenDayAvg ? `${sevenDayAvg}kg` : '继续记录'} />
        <Metric icon={<Target size={18} />} label="当前阶段" value={`第${stage.week}周`} />
        <Metric icon={<Droplets size={18} />} label="今日打卡" value={`${completionCount}/4`} />
      </div>

      <Card title="今日体重">
        <div className="inline-form">
          <NumberField label="体重" value={weightInput} onChange={setWeightInput} min={30} max={250} step={0.1} suffix="kg" />
          <button type="button" className="secondary-button" onClick={saveWeight}>
            保存
          </button>
        </div>
      </Card>

      <Card title="饮水与补剂">
        <div className="toggle-grid">
          <ToggleButton label="饮水达标" checked={todayRecord?.waterOnTarget} onChange={(value) => upsertCheckIn({ date: today, waterOnTarget: value })} />
          <ToggleButton label="肌酸3-5g" checked={todayRecord?.creatineTaken} onChange={(value) => upsertCheckIn({ date: today, creatineTaken: value })} />
          <ToggleButton label="蛋白粉" checked={todayRecord?.proteinPowderTaken} onChange={(value) => upsertCheckIn({ date: today, proteinPowderTaken: value })} />
          <ToggleButton label="蛋白达标" checked={todayRecord?.proteinOnTarget} onChange={(value) => upsertCheckIn({ date: today, proteinOnTarget: value })} />
        </div>
      </Card>

      <Card title="阶段目标">
        <div className="goal-ladder">
          {['91kg', '86kg', '82kg', '78kg'].map((goal) => (
            <span key={goal} className={Number(goal.replace('kg', '')) >= currentWeight ? 'done' : ''}>
              {goal}
            </span>
          ))}
        </div>
        <p className="support-text">
          {stage.label}，当前目标体重阶段：{getTargetStage(currentWeight)}。
        </p>
      </Card>
    </>
  );
}

import { useState } from 'react';
import { Save, Utensils } from 'lucide-react';
import { Card } from '../components/Card';
import { ToggleButton } from '../components/Controls';
import { getCheckIn } from '../lib/stats';
import { todayKey } from '../lib/date';
import type { DailyCheckIn, FitnessData } from '../types';

interface NutritionPageProps {
  data: FitnessData;
  upsertCheckIn: (patch: Partial<DailyCheckIn> & { date?: string }) => void;
}

export default function NutritionPage({ data, upsertCheckIn }: NutritionPageProps) {
  const today = todayKey();
  const record = getCheckIn(data, today);
  const [notes, setNotes] = useState(record?.notes ?? '');
  const targets = data.profile.targets;

  const update = (patch: Partial<DailyCheckIn>) => upsertCheckIn({ date: today, ...patch });

  const positiveCount = [
    record?.caloriesOnTarget,
    record?.proteinOnTarget,
    record?.waterOnTarget,
    record?.creatineTaken,
    record?.proteinPowderTaken,
  ].filter(Boolean).length;

  return (
    <>
      <Card title="饮食目标" action={<Utensils size={20} />}>
        <div className="target-grid">
          <span>
            热量<strong>{targets.calorieMin}-{targets.calorieMax} kcal</strong>
          </span>
          <span>
            蛋白质<strong>{targets.proteinMin}-{targets.proteinMax}g</strong>
          </span>
          <span>
            饮水<strong>{targets.waterMin}-{targets.waterMax}L</strong>
          </span>
          <span>
            今日完成<strong>{positiveCount}/5</strong>
          </span>
        </div>
      </Card>

      <Card title="今日打卡">
        <div className="toggle-grid">
          <ToggleButton label="热量达标" checked={record?.caloriesOnTarget} onChange={(value) => update({ caloriesOnTarget: value })} />
          <ToggleButton label="蛋白质达标" checked={record?.proteinOnTarget} onChange={(value) => update({ proteinOnTarget: value })} />
          <ToggleButton label="饮水达标" checked={record?.waterOnTarget} onChange={(value) => update({ waterOnTarget: value })} />
          <ToggleButton label="肌酸3-5g" checked={record?.creatineTaken} onChange={(value) => update({ creatineTaken: value })} />
          <ToggleButton label="蛋白粉" checked={record?.proteinPowderTaken} onChange={(value) => update({ proteinPowderTaken: value })} />
          <ToggleButton label="含糖饮料" checked={record?.sugaryDrink} onChange={(value) => update({ sugaryDrink: value })} danger />
          <ToggleButton label="夜宵" checked={record?.lateSnack} onChange={(value) => update({ lateSnack: value })} danger />
          <ToggleButton label="饮酒" checked={record?.alcohol} onChange={(value) => update({ alcohol: value })} danger />
        </div>
      </Card>

      <Card title="今日饮食备注">
        <label className="field">
          <span>备注</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="例如：外食、蛋白来源、饥饿感" />
        </label>
        <button type="button" className="primary-button full" onClick={() => update({ notes })}>
          <Save size={18} />
          保存备注
        </button>
      </Card>
    </>
  );
}

import { ChangeEvent, useState } from 'react';
import { Download, Save, Upload } from 'lucide-react';
import { Card } from '../components/Card';
import { NumberField } from '../components/Controls';
import type { FitnessData, TrainingDaysPerWeek, UserProfile } from '../types';

interface SettingsPageProps {
  data: FitnessData;
  updateProfile: (patch: Partial<UserProfile>) => void;
  replaceAllData: (raw: unknown) => void;
  resetAllData: () => void;
}

export default function SettingsPage({ data, updateProfile, replaceAllData, resetAllData }: SettingsPageProps) {
  const [profile, setProfile] = useState<UserProfile>(data.profile);
  const [importText, setImportText] = useState('');

  const updateTarget = (key: keyof UserProfile['targets'], value: number | '') => {
    setProfile((current) => ({
      ...current,
      targets: { ...current.targets, [key]: value === '' ? 0 : value },
    }));
  };

  const saveProfile = () => {
    const confirmedProfile = { ...profile, profileConfirmed: true };
    setProfile(confirmedProfile);
    updateProfile(confirmedProfile);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (text: string) => {
    try {
      replaceAllData(JSON.parse(text));
      setImportText('');
      window.alert('导入成功。');
    } catch {
      window.alert('JSON格式不正确，请检查后再导入。');
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importJson(String(reader.result ?? ''));
    reader.readAsText(file);
  };

  const clearData = () => {
    if (!window.confirm('确认清空全部本地数据？')) return;
    if (!window.confirm('再次确认：训练、体重、饮食、恢复记录都会被删除。')) return;
    resetAllData();
    setProfile(data.profile);
  };

  return (
    <>
      <Card title="个人信息">
        <label className="field">
          <span>姓名</span>
          <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
        </label>
        <div className="two-col">
          <NumberField label="年龄" value={profile.age} onChange={(value) => setProfile({ ...profile, age: value || 0 })} min={1} max={120} suffix="岁" />
          <NumberField label="身高" value={profile.heightCm} onChange={(value) => setProfile({ ...profile, heightCm: value || 0 })} min={80} max={240} suffix="cm" />
        </div>
        <div className="two-col">
          <NumberField
            label="起始体重"
            value={profile.startWeightKg}
            onChange={(value) => setProfile({ ...profile, startWeightKg: value || 0 })}
            min={30}
            max={250}
            step={0.1}
            suffix="kg"
          />
          <NumberField
            label="目标体重"
            value={profile.targetWeightKg}
            onChange={(value) => setProfile({ ...profile, targetWeightKg: value || 0 })}
            min={30}
            max={250}
            step={0.1}
            suffix="kg"
          />
        </div>
        <label className="field">
          <span>训练开始日期</span>
          <input type="date" value={profile.startDate} onChange={(event) => setProfile({ ...profile, startDate: event.target.value })} />
        </label>
        <div className="field">
          <span>每周训练天数</span>
          <div className="plan-selector">
            {[4, 5].map((days) => (
              <button
                key={days}
                type="button"
                className={profile.trainingDaysPerWeek === days ? 'selected' : ''}
                onClick={() => setProfile({ ...profile, trainingDaysPerWeek: days as TrainingDaysPerWeek })}
              >
                {days}练
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card title="饮食目标">
        <div className="two-col">
          <NumberField label="热量下限" value={profile.targets.calorieMin} onChange={(value) => updateTarget('calorieMin', value)} min={1000} max={5000} suffix="kcal" />
          <NumberField label="热量上限" value={profile.targets.calorieMax} onChange={(value) => updateTarget('calorieMax', value)} min={1000} max={5000} suffix="kcal" />
        </div>
        <div className="two-col">
          <NumberField label="蛋白下限" value={profile.targets.proteinMin} onChange={(value) => updateTarget('proteinMin', value)} min={50} max={300} suffix="g" />
          <NumberField label="蛋白上限" value={profile.targets.proteinMax} onChange={(value) => updateTarget('proteinMax', value)} min={50} max={300} suffix="g" />
        </div>
        <div className="two-col">
          <NumberField label="饮水下限" value={profile.targets.waterMin} onChange={(value) => updateTarget('waterMin', value)} min={1} max={10} step={0.1} suffix="L" />
          <NumberField label="饮水上限" value={profile.targets.waterMax} onChange={(value) => updateTarget('waterMax', value)} min={1} max={10} step={0.1} suffix="L" />
        </div>
        <button type="button" className="primary-button full" onClick={saveProfile}>
          <Save size={18} />
          保存设置
        </button>
      </Card>

      <Card title="数据管理">
        <div className="backup-reminder">
          <strong>数据备份提醒</strong>
          <p>建议每周导出一次JSON备份。换手机、清理浏览器缓存或重新安装PWA前，请先导出并保存备份文件。</p>
        </div>
        <div className="button-row">
          <button type="button" className="secondary-button" onClick={exportJson}>
            <Download size={18} />
            导出JSON
          </button>
          <label className="secondary-button file-button">
            <Upload size={18} />
            导入文件
            <input type="file" accept="application/json" onChange={handleFile} />
          </label>
        </div>
        <label className="field">
          <span>粘贴JSON导入</span>
          <textarea value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="把导出的JSON粘贴到这里" />
        </label>
        <button type="button" className="ghost-button full" onClick={() => importJson(importText)} disabled={!importText.trim()}>
          从文本导入
        </button>
        <button type="button" className="danger-button full" onClick={clearData}>
          清空全部数据
        </button>
      </Card>

      <Card title="隐私说明">
        <p className="support-text">所有数据仅保存在本机浏览器 localStorage 中，不上传服务器。更换浏览器、清理站点数据或卸载应用前，请先导出JSON备份。没有账号系统时，不要把隐私照片、身份证、联系方式等敏感信息写死到项目代码中。</p>
      </Card>
    </>
  );
}

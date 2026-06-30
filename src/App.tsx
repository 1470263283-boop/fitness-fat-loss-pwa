import { useState } from 'react';
import { Activity, Clock3, History, Settings } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { SegmentedControl } from './components/Controls';
import { useFitnessData } from './hooks/useFitnessData';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import NutritionPage from './pages/NutritionPage';
import PlanPage from './pages/PlanPage';
import ProgressPage from './pages/ProgressPage';
import RecoveryPage from './pages/RecoveryPage';
import SettingsPage from './pages/SettingsPage';
import WorkoutPage from './pages/WorkoutPage';

export type RouteKey = 'dashboard' | 'training' | 'progress' | 'nutrition' | 'more';
type TrainingTab = 'workout' | 'plan';
type MoreTab = 'recovery' | 'history' | 'settings';

function App() {
  const fitness = useFitnessData();
  const [route, setRoute] = useState<RouteKey>('dashboard');
  const [trainingTab, setTrainingTab] = useState<TrainingTab>('workout');
  const [moreTab, setMoreTab] = useState<MoreTab>('recovery');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">12周减脂塑型</p>
          <h1>健身打卡</h1>
        </div>
        <span className="status-pill">本地保存</span>
      </header>

      <main className="page-stack">
        {route === 'dashboard' && (
          <DashboardPage
            {...fitness}
            onNavigate={setRoute}
            onOpenSettings={() => {
              setMoreTab('settings');
              setRoute('more');
            }}
          />
        )}

        {route === 'training' && (
          <>
            <SegmentedControl
              value={trainingTab}
              onChange={setTrainingTab}
              options={[
                { value: 'workout', label: '今日训练', icon: <Clock3 size={16} /> },
                { value: 'plan', label: '训练计划', icon: <Activity size={16} /> },
              ]}
            />
            {trainingTab === 'workout' ? <WorkoutPage {...fitness} /> : <PlanPage data={fitness.data} />}
          </>
        )}

        {route === 'progress' && <ProgressPage {...fitness} />}
        {route === 'nutrition' && <NutritionPage {...fitness} />}

        {route === 'more' && (
          <>
            <SegmentedControl
              value={moreTab}
              onChange={setMoreTab}
              options={[
                { value: 'recovery', label: '恢复', icon: <Activity size={16} /> },
                { value: 'history', label: '历史', icon: <History size={16} /> },
                { value: 'settings', label: '设置', icon: <Settings size={16} /> },
              ]}
            />
            {moreTab === 'recovery' && <RecoveryPage {...fitness} />}
            {moreTab === 'history' && <HistoryPage {...fitness} />}
            {moreTab === 'settings' && <SettingsPage {...fitness} />}
          </>
        )}
      </main>

      <BottomNav route={route} onRouteChange={setRoute} />
    </div>
  );
}

export default App;

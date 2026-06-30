import { BarChart3, Dumbbell, Home, User, Utensils } from 'lucide-react';
import type { RouteKey } from '../App';

const tabs = [
  { key: 'dashboard', label: '首页', icon: Home },
  { key: 'training', label: '训练', icon: Dumbbell },
  { key: 'progress', label: '进度', icon: BarChart3 },
  { key: 'nutrition', label: '饮食', icon: Utensils },
  { key: 'more', label: '我的', icon: User },
] as const;

interface BottomNavProps {
  route: RouteKey;
  onRouteChange: (route: RouteKey) => void;
}

export function BottomNav({ route, onRouteChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="底部导航">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = route === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            className={active ? 'active' : ''}
            onClick={() => onRouteChange(tab.key)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={21} strokeWidth={2.2} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

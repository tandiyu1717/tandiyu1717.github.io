import { useState, useMemo } from 'react';
import GermanPage from './pages/GermanPage.jsx';
import EggBaoPage from './pages/EggBaoPage.jsx';
import WeightPage from './pages/WeightPage.jsx';
import FoodPage from './pages/FoodPage.jsx';
import DailyPlanPage from './pages/DailyPlanPage.jsx';

const NAV_ITEMS = [
  { id: 'egg', label: '蛋堡的早教计划', icon: '🍼' },
  { id: 'food', label: '蛋堡辅食计划', icon: '🥣' },
  { id: 'german', label: '德语学习', icon: '📖' },
  { id: 'weight', label: '减肥计划', icon: '💪' },
  { id: 'daily', label: '每日计划', icon: '📅' },
];

function Sidebar({ active, onChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo"><span className="leaf">🌿</span>小生活工作台</div>
        <div className="sub">每日进步一点点</div>
      </div>
      <nav>
        <ul className="nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onChange(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="footer">
        v1.0 · 豆绿暖米
      </div>
    </aside>
  );
}

function getInitialPage() {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('p');
  const valid = ['egg', 'food', 'german', 'weight', 'daily'];
  return valid.includes(p) ? p : 'egg';
}

export default function App() {
  const [active, setActive] = useState(getInitialPage);

  const page = useMemo(() => {
    switch (active) {
      case 'egg': return <EggBaoPage />;
      case 'food': return <FoodPage />;
      case 'german': return <GermanPage />;
      case 'weight': return <WeightPage />;
      case 'daily': return <DailyPlanPage />;
      default: return null;
    }
  }, [active]);

  return (
    <div className="layout">
      <Sidebar active={active} onChange={setActive} />
      <main className="main">{page}</main>
    </div>
  );
}

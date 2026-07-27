import { useState, useMemo } from 'react';
import GermanPage from './pages/GermanPage.jsx';
import EggBaoPage from './pages/EggBaoPage.jsx';
import WeightPage from './pages/WeightPage.jsx';
import FoodPage from './pages/FoodPage.jsx';
import DailyPlanPage from './pages/DailyPlanPage.jsx';
import { getTodayQuote } from './utils.js';

const NAV_ITEMS = [
  { id: 'daily', label: '每日计划', icon: '📅' },
  { id: 'egg', label: '蛋堡早教训练', icon: '🍼' },
  { id: 'food', label: '蛋堡辅食', icon: '🥣' },
  { id: 'german', label: '德语学习', icon: '📖' },
  { id: 'weight', label: '减肥计划', icon: '💪' },
];

function Sidebar({ active, onChange }) {
  const quote = useMemo(() => getTodayQuote(), []);
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">
          <img className="mascot" src="/mascot.jpg" alt="谭迪予的工作台吉祥物" />
          <span className="brand-name">谭迪予的工作台</span>
        </div>
        <div className="soup-quote">{quote}</div>
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
                <span className="label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="footer">v1.2 · 谭迪予</div>
    </aside>
  );
}

function getInitialPage() {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('p');
  const valid = ['daily', 'egg', 'food', 'german', 'weight'];
  return valid.includes(p) ? p : 'daily';
}

export default function App() {
  const [active, setActive] = useState(getInitialPage);

  const page = useMemo(() => {
    switch (active) {
      case 'daily': return <DailyPlanPage />;
      case 'egg': return <EggBaoPage />;
      case 'food': return <FoodPage />;
      case 'german': return <GermanPage />;
      case 'weight': return <WeightPage />;
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

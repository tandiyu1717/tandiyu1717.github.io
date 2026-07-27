import { useState, useEffect, useMemo } from 'react';

// 任务类别
const CATEGORIES = {
  egg:    { label: '蛋堡早教', icon: '🍼', cls: 'egg' },
  food:   { label: '蛋堡辅食', icon: '🥣', cls: 'food' },
  german: { label: '德语学习', icon: '📖', cls: 'german' },
  weight: { label: '减肥计划', icon: '💪', cls: 'weight' },
};

// 整合四项的每日时间轴任务（已去掉母乳喂养相关项）
const DAILY_TASKS = [
  // 早晨
  { id: 't01', time: '06:00', period: 'morning', cat: 'egg',    title: '蛋堡起床 + 补充维生素 D3', note: '今天轮到 D3，明天 AD' },
  { id: 't02', time: '06:30', period: 'morning', cat: 'weight', title: '晨起空腹上阿福体脂秤测量', note: '排便后测量最准确' },
  { id: 't04', time: '07:30', period: 'morning', cat: 'weight', title: '喝水 500ml + 营养早餐', note: '全麦面包+鸡蛋+牛奶' },
  { id: 't05', time: '08:00', period: 'morning', cat: 'egg',    title: '蛋堡趴卧练习 10 分钟', note: '锻炼颈背力量，为爬行打基础' },
  { id: 't06', time: '09:00', period: 'morning', cat: 'german', title: '德语背 20 个 A1 单词', note: '用 Memrise 或德语助手' },
  { id: 't07', time: '10:00', period: 'morning', cat: 'food',   title: '蛋堡补充维生素（上午）', note: '上午十点左右补充' },
  { id: 't08', time: '10:30', period: 'morning', cat: 'food',   title: '蛋堡上午辅食 - 软烂粥', note: '蔬菜泥+少量肉泥，粥要煮烂' },
  { id: 't09', time: '11:00', period: 'morning', cat: 'german', title: '德语视频教程 30 分钟', note: '按顺序学习，做笔记' },
  // 中午
  { id: 't10', time: '12:00', period: 'noon',     cat: 'weight', title: '午餐七八分饱', note: '主食1拳+蛋白质1掌心+蔬菜2拳' },
  { id: 't11', time: '13:00', period: 'noon',     cat: 'egg',    title: '蛋堡午睡 1.5-2 小时', note: '保证充足睡眠' },
  // 下午
  { id: 't12', time: '14:00', period: 'afternoon', cat: 'weight', title: '产后修复操 15 分钟', note: '腹式呼吸+凯格尔+骨盆恢复' },
  { id: 't13', time: '14:30', period: 'afternoon', cat: 'german', title: '德语语法学习 30 分钟', note: '今日教学：名词词性与冠词' },
  { id: 't14', time: '15:00', period: 'afternoon', cat: 'egg',    title: '蛋堡读绘本 2 本（语言训练）', note: '指着图片说名称，语速慢' },
  { id: 't15', time: '16:00', period: 'afternoon', cat: 'egg',    title: '蛋堡户外活动 + 手膝爬训练', note: '重点训练！前方放玩具吸引' },
  { id: 't16', time: '16:30', period: 'afternoon', cat: 'food',   title: '蛋堡下午辅食 + 水果泥', note: '蛋黄从1/4个开始尝试' },
  { id: 't17', time: '17:30', period: 'afternoon', cat: 'german', title: '德语听力跟读 5 分钟', note: '每日德语听力 APP' },
  // 晚上
  { id: 't18', time: '18:00', period: 'evening', cat: 'food',   title: '蛋堡洗澡 + 补充碳酸钙', note: '晚上六点左右补钙' },
  { id: 't19', time: '18:30', period: 'evening', cat: 'weight', title: '晚餐清淡（少主食）', note: '蛋白质+大量绿叶蔬菜' },
  { id: 't20', time: '19:00', period: 'evening', cat: 'egg',    title: '蛋堡手膝爬训练 30 分钟', note: '大动作重点！推脚辅助' },
  { id: 't22', time: '20:30', period: 'evening', cat: 'egg',    title: '蛋堡入睡 + 睡前绘本', note: '建立睡眠仪式' },
  { id: 't23', time: '21:00', period: 'evening', cat: 'weight', title: '饭后散步 40 分钟', note: '不喝奶茶，不吃零食' },
  { id: 't24', time: '22:00', period: 'evening', cat: 'german', title: '德语整理本周错题', note: '复习巩固' },
  { id: 't25', time: '23:00', period: 'evening', cat: 'weight', title: '11 点前睡觉', note: '保证哺乳期睡眠' },
];

const PERIODS = [
  { key: 'morning',   label: '🌅 上午', range: '06:00 - 11:59' },
  { key: 'noon',      label: '☀️ 中午', range: '12:00 - 13:59' },
  { key: 'afternoon', label: '🌤️ 下午', range: '14:00 - 17:59' },
  { key: 'evening',   label: '🌙 晚上', range: '18:00 - 23:00' },
];

// 打卡数据结构：{ taskId: { done: true, time: '14:32' } }
const STORAGE_KEY = 'daily_plan_checkin_v2';
const MONTH_KEY = 'daily_plan_month_v2';

export default function DailyPlanPage() {
  const today = new Date();
  const todayDate = today.getDate();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthLabel = `${year}年${month + 1}月`;

  const [activeTab, setActiveTab] = useState('timeline');

  const todayStr = today.toISOString().slice(0, 10); // 如 "2026-07-27"

  // 打卡记录：{ taskId: { done, time } } —— 按日期自动重置，新的一天从0开始
  const [done, setDone] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      if (parsed && parsed.date === todayStr) return parsed.done || {};
      return {}; // 日期不一致，重置为未打卡
    } catch {
      return {};
    }
  });

  // 月度数据：{ day: rate }，从0开始（不生成模拟历史数据）
  const [monthData, setMonthData] = useState(() => {
    try {
      const saved = localStorage.getItem(MONTH_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && parsed.month === month) return parsed.data;
      return {};
    } catch {
      return {};
    }
  });

  // 持久化打卡状态（带上日期标记，跨天自动重置）
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayStr, done }));
    } catch {}
  }, [done, todayStr]);

  // 页面从后台切回前台时，检查是否跨天了，跨天则自动重置打卡
  useEffect(() => {
    const checkDate = () => {
      const nowStr = new Date().toISOString().slice(0, 10);
      if (nowStr !== todayStr) {
        setDone({}); // 新的一天，清空打卡
      }
    };
    document.addEventListener('visibilitychange', checkDate);
    window.addEventListener('focus', checkDate);
    return () => {
      document.removeEventListener('visibilitychange', checkDate);
      window.removeEventListener('focus', checkDate);
    };
  }, [todayStr]);

  // 持久化月度数据，把今日完成率同步进去
  useEffect(() => {
    const todayRate = Math.round(
      (Object.values(done).filter((v) => v && v.done).length / DAILY_TASKS.length) * 100
    );
    const newData = { ...monthData, [todayDate]: todayRate };
    setMonthData(newData);
    try {
      localStorage.setItem(MONTH_KEY, JSON.stringify({ month, data: newData }));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // 打卡/取消打卡 - 同时记录当时时间
  const toggle = (id) => {
    setDone((prev) => {
      const existing = prev[id];
      if (existing && existing.done) {
        // 取消打卡
        const next = { ...prev };
        delete next[id];
        return next;
      }
      // 打卡：记录当前时间
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      return { ...prev, [id]: { done: true, time: `${hh}:${mm}:${ss}` } };
    });
  };

  // 今日统计
  const doneCount = Object.values(done).filter((v) => v && v.done).length;
  const totalCount = DAILY_TASKS.length;
  const todayRate = Math.round((doneCount / totalCount) * 100);

  // 按类别统计
  const catStats = useMemo(() => {
    const stats = {};
    Object.keys(CATEGORIES).forEach((c) => {
      const tasks = DAILY_TASKS.filter((t) => t.cat === c);
      const d = tasks.filter((t) => done[t.id] && done[t.id].done).length;
      stats[c] = { total: tasks.length, done: d, rate: tasks.length ? Math.round((d / tasks.length) * 100) : 0 };
    });
    return stats;
  }, [done]);

  // 月度统计
  const monthValues = Object.entries(monthData)
    .filter(([day, v]) => v !== null && v !== undefined && Number(day) <= todayDate)
    .map(([day, v]) => v);
  const checkedDays = monthValues.filter((v) => v > 0).length;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthAvgRate = monthValues.length ? Math.round(monthValues.reduce((a, b) => a + b, 0) / monthValues.length) : 0;

  // 连续打卡天数（从今天往前数）
  const streak = useMemo(() => {
    let s = 0;
    for (let d = todayDate; d >= 1; d--) {
      const v = monthData[d];
      if (v !== null && v !== undefined && v > 0) s++;
      else if (d < todayDate) break;
    }
    return s;
  }, [monthData, todayDate]);

  // 按时段分组
  const tasksByPeriod = useMemo(() => {
    const grouped = {};
    PERIODS.forEach((p) => { grouped[p.key] = []; });
    DAILY_TASKS.forEach((t) => {
      if (grouped[t.period]) grouped[t.period].push(t);
    });
    return grouped;
  }, []);

  const getDayColor = (rate) => {
    if (rate === null || rate === undefined) return 'empty';
    if (rate === 0) return 'zero';
    if (rate < 34) return 'low';
    if (rate < 67) return 'mid';
    return 'high';
  };

  // 当前时间对应的下一个待办任务
  const nowStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
  const nextTask = DAILY_TASKS.find((t) => t.time >= nowStr && !(done[t.id] && done[t.id].done));

  return (
    <div>
      <div className="page-header">
        <h1>📅 每日计划</h1>
        <p>整合四大计划，按时间轴一站式打卡 🌿</p>
        <div className="meta">
          <span className="tag">{monthLabel}</span>
          <span className="tag warm">🔥 连续 {streak} 天</span>
          <span className="tag">✅ 今日 {doneCount}/{totalCount}</span>
        </div>
      </div>

      <div className="cards">
        <div className="card green">
          <div className="icon">📊</div>
          <div className="label">今日完成率</div>
          <div className="value">{todayRate}<span className="unit">%</span></div>
        </div>
        <div className="card warm">
          <div className="icon">🗓️</div>
          <div className="label">本月打卡</div>
          <div className="value">{checkedDays}<span className="unit">/ {todayDate} 天</span></div>
        </div>
        <div className="card">
          <div className="icon">📈</div>
          <div className="label">本月平均</div>
          <div className="value">{monthAvgRate}<span className="unit">%</span></div>
        </div>
        <div className="card green">
          <div className="icon">🔥</div>
          <div className="label">连续打卡</div>
          <div className="value">{streak}<span className="unit">天</span></div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>⏰ 今日时间轴</button>
        <button className={`tab ${activeTab === 'month' ? 'active' : ''}`} onClick={() => setActiveTab('month')}>🗓️ 月度完成情况</button>
        <button className={`tab ${activeTab === 'category' ? 'active' : ''}`} onClick={() => setActiveTab('category')}>📊 分类统计</button>
      </div>

      {activeTab === 'timeline' && (
        <>
          <div className="panel">
            <h2>📊 今日整体进度</h2>
            <div className="muted" style={{ marginBottom: 10 }}>
              {doneCount} / {totalCount} 项已完成 · {todayRate}%
              <div className="progress"><div className="bar" style={{ width: `${todayRate}%` }} /></div>
            </div>
            {nextTask && (
              <div className="next-task">
                <span className="label">⏭️ 下一个待办</span>
                <span className="time">{nextTask.time}</span>
                <span className="title">{nextTask.title}</span>
                <span className={`cat-tag ${CATEGORIES[nextTask.cat].cls}`}>
                  {CATEGORIES[nextTask.cat].icon} {CATEGORIES[nextTask.cat].label}
                </span>
              </div>
            )}
          </div>

          {PERIODS.map((p) => (
            <div key={p.key} className="panel">
              <h2>{p.label} <span className="period-range">{p.range}</span></h2>
              <div className="daily-timeline">
                {(tasksByPeriod[p.key] || []).map((task) => {
                  const cat = CATEGORIES[task.cat];
                  const record = done[task.id];
                  const isDone = !!(record && record.done);
                  const checkTime = record && record.time;
                  return (
                    <div key={task.id} className={`daily-task ${cat.cls} ${isDone ? 'done' : ''}`}>
                      <div className="task-time">{task.time}</div>
                      <div
                        className="task-check"
                        onClick={() => toggle(task.id)}
                        role="checkbox"
                        aria-checked={isDone}
                      >
                        {isDone ? '✓' : ''}
                      </div>
                      <div className="task-main">
                        <div className="task-title">{task.title}</div>
                        {task.note && <div className="task-note">{task.note}</div>}
                        {isDone && checkTime && (
                          <div className="task-checktime">✓ 打卡于 {checkTime}</div>
                        )}
                      </div>
                      <div className={`cat-tag ${cat.cls}`}>{cat.icon} {cat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="panel warm">
            <p style={{ margin: 0, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
              💡 提示：本页整合了「蛋堡早教、蛋堡辅食、德语学习、减肥计划」四大计划的每日核心任务，按时间轴排列。点击圆圈打卡后会自动记录打卡时间，方便你回顾一天的节奏。
            </p>
          </div>
        </>
      )}

      {activeTab === 'month' && (
        <>
          <div className="panel">
            <h2>🗓️ {monthLabel} 打卡日历</h2>
            <div className="month-stats">
              <div className="stat">📅 本月已过 <strong>{todayDate}</strong> 天</div>
              <div className="stat">✅ 打卡 <strong>{checkedDays}</strong> 天</div>
              <div className="stat">📊 平均完成率 <strong>{monthAvgRate}%</strong></div>
              <div className="stat">🔥 连续 <strong>{streak}</strong> 天</div>
            </div>
            <div className="month-grid">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const rate = monthData[day];
                const isToday = day === todayDate;
                const isPast = day < todayDate;
                const color = getDayColor(rate);
                return (
                  <div
                    key={day}
                    className={`month-day ${color} ${isToday ? 'today' : ''} ${isPast ? 'past' : 'future'}`}
                    title={rate !== null && rate !== undefined ? `${day}日 · 完成率 ${rate}%` : `${day}日`}
                  >
                    <span className="day-num">{day}</span>
                    {rate !== null && rate !== undefined && rate > 0 && (
                      <span className="day-rate">{rate}%</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="month-legend">
              <span className="legend-item"><span className="legend-box empty"></span>未到</span>
              <span className="legend-item"><span className="legend-box zero"></span>0%</span>
              <span className="legend-item"><span className="legend-box low"></span>1-33%</span>
              <span className="legend-item"><span className="legend-box mid"></span>34-66%</span>
              <span className="legend-item"><span className="legend-box high"></span>67-100%</span>
            </div>
          </div>

          <div className="panel warm">
            <h2>📊 月度趋势分析</h2>
            <div className="month-bars">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const rate = monthData[day];
                if (rate === null || rate === undefined) return (
                  <div key={day} className="month-bar empty" title={`${day}日 未到`}>
                    <div className="bar-fill" style={{ height: '0%' }}></div>
                    <span className="bar-label">{day}</span>
                  </div>
                );
                return (
                  <div key={day} className="month-bar" title={`${day}日 · ${rate}%`}>
                    <div className="bar-fill" style={{ height: `${rate}%` }}></div>
                    <span className="bar-label">{day}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ marginTop: 14, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
              💡 柱状图展示本月每日完成率，越高表示当天打卡越完整。坚持每日打卡，让进度看得见！
            </p>
          </div>

          <div className="panel">
            <h2>🎯 月度目标</h2>
            <div className="item-list">
              <div className="item-row">
                <span className="word" style={{ minWidth: '120px' }}>📅 打卡天数</span>
                <span className="meaning">本月坚持打卡 ≥ 25 天</span>
                <span className="tag">{checkedDays} / 25</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '120px' }}>📈 平均完成率</span>
                <span className="meaning">日均任务完成率 ≥ 80%</span>
                <span className={`tag ${monthAvgRate >= 80 ? '' : 'warm'}`}>{monthAvgRate}% / 80%</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '120px' }}>🔥 连续打卡</span>
                <span className="meaning">连续打卡 ≥ 7 天</span>
                <span className={`tag ${streak >= 7 ? '' : 'warm'}`}>{streak} / 7</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '120px' }}>🌟 完美日</span>
                <span className="meaning">单日完成率 100% 的天数</span>
                <span className="tag">{monthValues.filter((v) => v === 100).length} 天</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'category' && (
        <>
          <div className="panel">
            <h2>📊 四大计划完成情况</h2>
            <div className="cat-stats">
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const s = catStats[key];
                return (
                  <div key={key} className={`cat-card ${cat.cls}`}>
                    <div className="cat-head">
                      <span className="cat-icon">{cat.icon}</span>
                      <span className="cat-label">{cat.label}</span>
                    </div>
                    <div className="cat-rate">{s.rate}<span className="u">%</span></div>
                    <div className="cat-progress">
                      <div className="bar" style={{ width: `${s.rate}%` }}></div>
                    </div>
                    <div className="cat-detail">{s.done} / {s.total} 项已完成</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel warm">
            <h2>📝 各计划今日任务</h2>
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const tasks = DAILY_TASKS.filter((t) => t.cat === key);
              return (
                <div key={key} className="cat-section">
                  <h3>{cat.icon} {cat.label} <span className="muted">({catStats[key].done}/{tasks.length})</span></h3>
                  <ul className="tasks">
                    {tasks.map((t) => {
                      const record = done[t.id];
                      const isDone = !!(record && record.done);
                      const checkTime = record && record.time;
                      return (
                        <li key={t.id} className={`task ${isDone ? 'done' : ''}`}>
                          <div className="task-time-inline">{t.time}</div>
                          <div
                            className={`check ${isDone ? 'done' : ''}`}
                            onClick={() => toggle(t.id)}
                            role="checkbox"
                            aria-checked={isDone}
                          >
                            {isDone ? '✓' : ''}
                          </div>
                          <span className="title">
                            {t.title}
                            {isDone && checkTime && (
                              <span className="task-checktime-inline"> · {checkTime}</span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

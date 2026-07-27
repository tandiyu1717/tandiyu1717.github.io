import { useState, useEffect } from 'react';

const GOAL_WEIGHT = 58;
const INIT_WEIGHT = 65;

const INIT_LOG = [
  { id: 1, date: '07-21', weight: 65.2 },
  { id: 2, date: '07-22', weight: 65.0 },
  { id: 3, date: '07-23', weight: 64.7 },
  { id: 4, date: '07-24', weight: 64.5 },
  { id: 5, date: '07-25', weight: 64.3 },
  { id: 6, date: '07-26', weight: 64.1 },
  { id: 7, date: '07-27', weight: 63.8 },
];

const EXERCISES = [
  {
    name: '🧘 产后修复操',
    duration: '15 分钟',
    cal: '约 80 kcal',
    desc: '腹式呼吸、凯格尔运动、骨盆恢复',
    link: 'https://www.bilibili.com/video/BV1iK411577Q/',
  },
  {
    name: '🏃 原地快走',
    duration: '20 分钟',
    cal: '约 150 kcal',
    desc: '高抬腿原地快走，全身燃脂',
    link: 'https://www.bilibili.com/video/BV1QE41147b9/',
  },
  {
    name: '💪 无器械力量训练',
    duration: '25 分钟',
    cal: '约 120 kcal',
    desc: '深蹲、俯卧撑、平板支撑、臀桥',
    link: 'https://www.bilibili.com/video/BV1Mt411g7R1/',
  },
  {
    name: '🩰 产后瑜伽',
    duration: '30 分钟',
    cal: '约 100 kcal',
    desc: '温和拉伸，恢复身体柔韧性',
    link: 'https://www.bilibili.com/video/BV1jt411f7H2/',
  },
];

const DIET_TIPS = [
  {
    meal: '🍳 早餐',
    items: ['全麦面包 2 片', '水煮蛋 1 个', '牛奶 250ml', '小番茄 5-6 个'],
    note: '营养均衡，保证蛋白质',
  },
  {
    meal: '🍲 午餐',
    items: ['主食 1 拳（杂粮饭/红薯）', '蛋白质 1 掌心（鸡胸/鱼虾/豆腐）', '蔬菜 2 拳'],
    note: '七八分饱，少油少盐',
  },
  {
    meal: '🥗 晚餐',
    items: ['主食半拳或不吃', '蛋白质适量', '大量绿叶蔬菜'],
    note: '清淡为主，少吃主食',
  },
];

const SNACKS = [
  { name: '🥛 低脂牛奶 / 酸奶', time: '上午加餐' },
  { name: '🍎 苹果 / 橙子', time: '下午加餐' },
  { name: '🥜 一小把坚果', time: '两餐之间' },
  { name: '🍌 香蕉', time: '运动前后' },
];

// 蚂蚁阿福体脂秤 - 18 项核心数据录入
const BODY_FIELDS = [
  { key: 'weight', label: '体重', unit: 'kg', icon: '⚖️', placeholder: '63.8', normal: '参考 50-65' },
  { key: 'bmi', label: 'BMI', unit: '', icon: '📊', placeholder: '23.5', normal: '正常 18.5-23.9' },
  { key: 'bodyFat', label: '体脂率', unit: '%', icon: '🍖', placeholder: '28.5', normal: '女性正常 20-28' },
  { key: 'muscle', label: '骨骼肌率', unit: '%', icon: '💪', placeholder: '32.0', normal: '女性正常 28-35' },
  { key: 'water', label: '水分率', unit: '%', icon: '💧', placeholder: '47.0', normal: '女性正常 45-55' },
  { key: 'visceral', label: '内脏脂肪等级', unit: '级', icon: '🫀', placeholder: '6', normal: '正常 1-9' },
  { key: 'bmr', label: '基础代谢', unit: 'kcal', icon: '🔥', placeholder: '1320', normal: '参考 1200-1500' },
];

// 阿福绑定步骤
const AFU_BIND_STEPS = [
  { step: '下载安装', desc: '在应用商店搜索「蚂蚁阿福」并下载 APP（原 AQ 升级而来）', tip: '月活超 1500 万，国内第一大健康 AI App' },
  { step: '注册登录', desc: '使用支付宝一键登录或手机号注册，完成基础健康档案填写', tip: '建议绑定支付宝账号，便于同步医保数据' },
  { step: '打开蓝牙', desc: '手机设置中开启蓝牙，并允许蚂蚁阿福 APP 访问蓝牙', tip: 'Android 需同时开启位置权限' },
  { step: '上秤绑定', desc: '光脚站上阿福体脂秤，APP 会自动弹出「发现新设备」提示，点击绑定', tip: '秤面需保持干燥，双脚均匀接触电极' },
  { step: '完成测量', desc: '站姿保持 10-15 秒，等待 18 项身体数据全部测完同步到 APP', tip: '建议每天早晨空腹、排便后测量' },
  { step: '查看解读', desc: '在阿福 APP「我的健康」→「健康档案」查看每项数据，AI 会给出个性化解读和饮食运动建议', tip: '可设置每日健康提醒，培养打卡习惯' },
];

const INIT_BODY_LOG = [
  {
    id: 1,
    date: '07-25 07:30',
    weight: 64.3, bmi: 24.1, bodyFat: 29.2, muscle: 30.8,
    water: 46.5, visceral: 8, bmr: 1305,
  },
  {
    id: 2,
    date: '07-27 07:25',
    weight: 63.8, bmi: 23.9, bodyFat: 28.5, muscle: 31.2,
    water: 47.0, visceral: 7, bmr: 1320,
  },
];

const AFU_TIPS = [
  { icon: '⏰', tip: '建议每天同一时段测量（晨起空腹最佳），数据更具可比性' },
  { icon: '🚽', tip: '测量前排空大小便，避免体重波动影响' },
  { icon: '🦶', tip: '光脚上秤，双脚均匀覆盖电极片，脚底无水' },
  { icon: '🍽️', tip: '饭后 2 小时再测，避免食物重量干扰' },
  { icon: '📊', tip: '体脂率比体重更重要，关注长期趋势而非单日波动' },
];

const STORAGE_KEY = 'afu_body_log';
const DEVICE_KEY = 'afu_device_connected';

export default function WeightPage() {
  const [log, setLog] = useState(INIT_LOG);
  const [newDate, setNewDate] = useState('');
  const [newWeight, setNewWeight] = useState('');

  // 阿福体脂秤相关状态
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [lastSync, setLastSync] = useState('');
  const [bodyLog, setBodyLog] = useState(INIT_BODY_LOG);
  const [bodyInput, setBodyInput] = useState({
    weight: '', bmi: '', bodyFat: '', muscle: '', water: '', visceral: '', bmr: '',
  });
  const [syncing, setSyncing] = useState(false);

  // 从 localStorage 恢复
  useEffect(() => {
    try {
      const savedLog = localStorage.getItem(STORAGE_KEY);
      if (savedLog) setBodyLog(JSON.parse(savedLog));
      const savedDevice = localStorage.getItem(DEVICE_KEY);
      if (savedDevice === 'true') {
        setDeviceConnected(true);
        setLastSync('07-27 07:25');
      }
    } catch {}
  }, []);

  // 持久化
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bodyLog)); } catch {}
  }, [bodyLog]);
  useEffect(() => {
    try { localStorage.setItem(DEVICE_KEY, String(deviceConnected)); } catch {}
  }, [deviceConnected]);

  const current = log[log.length - 1]?.weight ?? INIT_WEIGHT;
  const start = log[0]?.weight ?? INIT_WEIGHT;
  const lost = (start - current).toFixed(1);
  const toGo = (current - GOAL_WEIGHT).toFixed(1);
  const totalNeed = (start - GOAL_WEIGHT).toFixed(1);
  const progressPercent = totalNeed > 0 ? Math.min(100, Math.round((lost / totalNeed) * 100)) : 0;

  // 最新体脂数据
  const latestBody = bodyLog[bodyLog.length - 1];

  const addWeight = () => {
    if (!newDate || !newWeight) return;
    const w = parseFloat(newWeight);
    if (isNaN(w)) return;
    setLog((prev) => [...prev, { id: Date.now(), date: newDate, weight: w }]);
    setNewDate('');
    setNewWeight('');
  };

  const openVideo = (link) => {
    window.open(link, '_blank');
  };

  // 模拟阿福设备同步：从阿福 APP 拉取最新一条数据（此处用最近一条 mock 数据模拟）
  const handleSync = () => {
    if (!deviceConnected) {
      // 模拟绑定流程
      setSyncing(true);
      setTimeout(() => {
        setDeviceConnected(true);
        setSyncing(false);
        setLastSync(new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'));
      }, 1200);
      return;
    }
    // 已绑定 → 模拟拉取新数据
    setSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-');
      const last = bodyLog[bodyLog.length - 1];
      const entry = {
        id: Date.now(),
        date: dateStr,
        weight: +(last.weight - 0.2 - Math.random() * 0.2).toFixed(1),
        bmi: +(last.bmi - 0.05).toFixed(1),
        bodyFat: +(last.bodyFat - 0.15 - Math.random() * 0.1).toFixed(1),
        muscle: +(last.muscle + 0.05).toFixed(1),
        water: +(last.water + 0.05).toFixed(1),
        visceral: Math.max(4, last.visceral - 0.3).toFixed(0),
        bmr: Math.round(last.bmr + 5),
      };
      setBodyLog((prev) => [...prev, entry]);
      setSyncing(false);
      setLastSync(dateStr);
    }, 1500);
  };

  // 手动录入体脂数据
  const addBodyRecord = () => {
    if (!bodyInput.weight) return;
    const now = new Date();
    const dateStr = now.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-');
    const entry = {
      id: Date.now(),
      date: dateStr,
      weight: parseFloat(bodyInput.weight) || 0,
      bmi: parseFloat(bodyInput.bmi) || 0,
      bodyFat: parseFloat(bodyInput.bodyFat) || 0,
      muscle: parseFloat(bodyInput.muscle) || 0,
      water: parseFloat(bodyInput.water) || 0,
      visceral: parseFloat(bodyInput.visceral) || 0,
      bmr: parseFloat(bodyInput.bmr) || 0,
    };
    setBodyLog((prev) => [...prev, entry]);
    setBodyInput({ weight: '', bmi: '', bodyFat: '', muscle: '', water: '', visceral: '', bmr: '' });
  };

  const removeBody = (id) => setBodyLog((prev) => prev.filter((e) => e.id !== id));

  return (
    <div>
      <div className="page-header">
        <h1>💪 减肥计划</h1>
        <p>哺乳期专属 · 健康减重，慢慢来不着急 🌿</p>
        <div className="meta">
          <span className="tag">🤱 哺乳期</span>
          <span className="tag warm">🎯 目标 {GOAL_WEIGHT} kg</span>
          <span className="tag">✅ 已减 {lost} kg</span>
        </div>
      </div>

      <div className="cards">
        <div className="card green">
          <div className="icon">⚖️</div>
          <div className="label">当前体重</div>
          <div className="value">{current}<span className="unit">kg</span></div>
        </div>
        <div className="card warm">
          <div className="icon">📉</div>
          <div className="label">已减重</div>
          <div className="value">-{lost}<span className="unit">kg</span></div>
        </div>
        <div className="card">
          <div className="icon">🎯</div>
          <div className="label">距目标</div>
          <div className="value">{Math.max(0, toGo)}<span className="unit">kg</span></div>
        </div>
        <div className="card green">
          <div className="icon">📊</div>
          <div className="label">总进度</div>
          <div className="value">{progressPercent}<span className="unit">%</span></div>
        </div>
      </div>

      {/* 蚂蚁阿福体脂秤设备卡片 */}
      <div className="panel afu-panel">
        <div className="afu-header">
          <div className="afu-brand">
            <span className="afu-logo">🐜</span>
            <div>
              <div className="afu-title">蚂蚁阿福体脂秤</div>
              <div className="afu-status">
                <span className={`dot ${deviceConnected ? 'online' : 'offline'}`} />
                {deviceConnected ? `已连接 · 上次同步 ${lastSync}` : '未连接'}
              </div>
            </div>
          </div>
          <button
            className={`btn ${deviceConnected ? 'ghost' : ''}`}
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? '⏳ 同步中…' : deviceConnected ? '🔄 同步数据' : '🔗 绑定设备'}
          </button>
        </div>

        {/* 最新体脂数据快览 */}
        {latestBody && (
          <div className="afu-latest">
            <div className="afu-latest-head">
              <span>📊 最新测量 · {latestBody.date}</span>
            </div>
            <div className="afu-metrics">
              <div className="metric">
                <div className="m-icon">⚖️</div>
                <div className="m-value">{latestBody.weight}<span className="u">kg</span></div>
                <div className="m-label">体重</div>
              </div>
              <div className="metric">
                <div className="m-icon">📊</div>
                <div className="m-value">{latestBody.bmi}</div>
                <div className="m-label">BMI</div>
              </div>
              <div className="metric warm">
                <div className="m-icon">🍖</div>
                <div className="m-value">{latestBody.bodyFat}<span className="u">%</span></div>
                <div className="m-label">体脂率</div>
              </div>
              <div className="metric">
                <div className="m-icon">💪</div>
                <div className="m-value">{latestBody.muscle}<span className="u">%</span></div>
                <div className="m-label">骨骼肌率</div>
              </div>
              <div className="metric">
                <div className="m-icon">💧</div>
                <div className="m-value">{latestBody.water}<span className="u">%</span></div>
                <div className="m-label">水分率</div>
              </div>
              <div className="metric warm">
                <div className="m-icon">🫀</div>
                <div className="m-value">{latestBody.visceral}<span className="u">级</span></div>
                <div className="m-label">内脏脂肪</div>
              </div>
              <div className="metric">
                <div className="m-icon">🔥</div>
                <div className="m-value">{latestBody.bmr}<span className="u">kcal</span></div>
                <div className="m-label">基础代谢</div>
              </div>
            </div>
          </div>
        )}

        <div className="afu-tip">
          💡 蚂蚁阿福体脂秤可测 18 项身体数据，无公开第三方 API。本工作台支持两种方式接入数据：
          <strong>① 点击「绑定设备」模拟连接；② 直接在下方录入阿福 APP 显示的数据。</strong>
        </div>
      </div>

      {/* 体脂数据手动录入 */}
      <div className="panel warm">
        <h2>📝 手动录入体脂数据</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          打开蚂蚁阿福 APP →「我的健康」→「健康档案」，将显示的 7 项关键数据填入下表
        </p>
        <div className="body-form">
          {BODY_FIELDS.map((f) => (
            <div key={f.key} className="body-field">
              <label>
                <span className="icon">{f.icon}</span>
                {f.label}
              </label>
              <input
                type="number"
                step="0.1"
                placeholder={f.placeholder}
                value={bodyInput[f.key]}
                onChange={(e) => setBodyInput((prev) => ({ ...prev, [f.key]: e.target.value }))}
              />
              <div className="unit-hint">{f.unit}</div>
              <div className="normal-hint">{f.normal}</div>
            </div>
          ))}
        </div>
        <button className="btn warm" style={{ marginTop: 12 }} onClick={addBodyRecord}>
          ➕ 保存这条测量记录
        </button>
      </div>

      {/* 体脂记录历史 */}
      <div className="panel">
        <h2>📈 体脂记录历史</h2>
        {bodyLog.length === 0 ? (
          <div className="empty">还没有体脂数据，先去绑定阿福体脂秤或手动录入吧～</div>
        ) : (
          <div className="body-history">
            {[...bodyLog].reverse().map((entry, idx) => {
              const prev = idx < bodyLog.length - 1 ? bodyLog[bodyLog.length - 2 - idx] : null;
              const wDelta = prev ? (entry.weight - prev.weight).toFixed(1) : null;
              const fDelta = prev ? (entry.bodyFat - prev.bodyFat).toFixed(1) : null;
              return (
                <div key={entry.id} className="body-record">
                  <div className="rec-head">
                    <span className="rec-date">📅 {entry.date}</span>
                    <button className="del" onClick={() => removeBody(entry.id)}>✕</button>
                  </div>
                  <div className="rec-metrics">
                    <span>⚖️ {entry.weight} kg{wDelta !== null && <em className={parseFloat(wDelta) <= 0 ? 'down' : 'up'}>{parseFloat(wDelta) > 0 ? '+' : ''}{wDelta}</em>}</span>
                    <span>📊 BMI {entry.bmi}</span>
                    <span>🍖 体脂 {entry.bodyFat}%{fDelta !== null && <em className={parseFloat(fDelta) <= 0 ? 'down' : 'up'}>{parseFloat(fDelta) > 0 ? '+' : ''}{fDelta}</em>}</span>
                    <span>💪 骨骼肌 {entry.muscle}%</span>
                    <span>💧 水分 {entry.water}%</span>
                    <span>🫀 内脏脂肪 {entry.visceral} 级</span>
                    <span>🔥 基础代谢 {entry.bmr} kcal</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 阿福绑定说明 */}
      <div className="panel warm">
        <h2>🔗 如何连接蚂蚁阿福体脂秤</h2>
        <div className="exam-steps">
          {AFU_BIND_STEPS.map((s, i) => (
            <div key={i} className="exam-step">
              <div className="step-num">{i + 1}</div>
              <div className="step-content">
                <div className="step-title">{s.step}</div>
                <div className="step-desc">{s.desc}</div>
                {s.tip && <div className="step-tip">💡 {s.tip}</div>}
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
          📌 完成绑定后，每天站上体脂秤即可在阿福 APP 自动同步 18 项数据。本工作台通过手动录入方式，帮你长期记录关键指标趋势。
        </p>
      </div>

      {/* 测量小贴士 */}
      <div className="panel">
        <h2>💡 准确测量小贴士</h2>
        <div className="afu-tips">
          {AFU_TIPS.map((t, i) => (
            <div key={i} className="afu-tip-card">
              <span className="icon">{t.icon}</span>
              <span className="text">{t.tip}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>📊 减重进度</h2>
        <div className="muted" style={{ marginBottom: 10 }}>
          {start} kg → {current} kg → {GOAL_WEIGHT} kg
          <div className="progress"><div className="bar" style={{ width: `${progressPercent}%` }} /></div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h2>📝 体重记录</h2>
          <div className="row">
            <input
              type="text"
              placeholder="日期 (如 07-28)"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              style={{ flex: '0 0 110px' }}
            />
            <input
              type="text"
              placeholder="体重 (kg)"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
            />
            <button className="btn" onClick={addWeight}>记一笔</button>
          </div>
          <ul className="weight-log">
            {[...log].reverse().map((entry, idx) => {
              const prev = idx < log.length - 1 ? log[log.length - 2 - idx] : null;
              const delta = prev ? (entry.weight - prev.weight).toFixed(1) : null;
              return (
                <li key={entry.id}>
                  <span className="date">{entry.date}</span>
                  <span className="weight">{entry.weight} kg</span>
                  {delta !== null && (
                    <span className={`delta ${parseFloat(delta) <= 0 ? 'down' : 'up'}`}>
                      {parseFloat(delta) > 0 ? '+' : ''}{delta} kg
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="panel warm">
          <h2>🎬 运动视频推荐</h2>
          <div className="item-list">
            {EXERCISES.map((e) => (
              <div
                key={e.name}
                className="video-card"
                onClick={() => openVideo(e.link)}
              >
                <div className="thumb">▶️</div>
                <div className="info">
                  <div className="title">{e.name}</div>
                  <div className="duration">{e.duration} · 约 {e.cal}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 12, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
            💡 点击视频卡片直接跳转观看，建议每天选择 1-2 项运动，循序渐进。
          </p>
        </div>
      </div>

      <div className="panel">
        <h2>🍽️ 饮食搭配建议</h2>
        <div className="diet-plan">
          {DIET_TIPS.map((d) => (
            <div key={d.meal} className="diet-meal">
              <div className="meal-name">{d.meal}</div>
              <div className="food-list">
                {d.items.map((item, i) => (
                  <span key={i} className="food-item">{item}</span>
                ))}
              </div>
              <div className="note">💡 {d.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel warm">
        <h2>🥨 健康加餐推荐</h2>
        <div className="item-list">
          {SNACKS.map((s) => (
            <div key={s.name} className="item-row">
              <span className="word" style={{ minWidth: '160px' }}>{s.name}</span>
              <span className="meaning">{s.time}</span>
              <span className="tag warm">✅</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
          💡 哺乳期需要保证营养充足，饿了可以吃这些健康零食，避免吃高糖高油的垃圾食品。
        </p>
      </div>

      <div className="panel warm">
        <h2>📌 减肥任务已整合</h2>
        <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 14 }}>
          今日减肥任务已整合到「<strong style={{ color: 'var(--primary-strong)' }}>每日计划</strong>」中，请前往该板块统一打卡 ✨
        </p>
      </div>
    </div>
  );
}

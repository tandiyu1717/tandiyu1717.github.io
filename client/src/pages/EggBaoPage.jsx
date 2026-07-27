import { useState } from 'react';

const BABY_INFO = {
  name: '蛋堡',
  birthday: '2025-10-21',
  age: '8 个月',
  weight: '10.3 kg',
  height: '71 cm',
  note: '偏重，大动作略落后',
};

const TODAY_SUPPLEMENTS = [
  { time: '06:00', name: '维生素 D3', note: '今天轮到吃 D3', type: 'd3' },
  { time: '10:00', name: '维生素', note: '上午补充', type: 'vitamin' },
  { time: '18:00', name: '碳酸钙', note: '晚上补充', type: 'calcium' },
];

const MILESTONES = [
  { id: 1, age: '2 个月', content: '能抬头 45°', done: true },
  { id: 2, age: '3 个月', content: '会翻身、笑出声', done: true },
  { id: 3, age: '6 个月', content: '能独坐、添加辅食', done: true },
  { id: 4, age: '8 个月', content: '手膝爬行', done: false, urgent: true },
  { id: 5, age: '8 个月', content: '发出 mama/baba 音节', done: false, urgent: true },
  { id: 6, age: '9 个月', content: '扶物站立', done: false },
  { id: 7, age: '10 个月', content: '挥手再见', done: false },
  { id: 8, age: '12 个月', content: '独走几步', done: false },
];

const GROSS_MOTOR = [
  {
    name: '🐸 趴卧练习',
    desc: '每天 3-4 次，每次 10-15 分钟',
    target: '锻炼颈背力量，为爬行打基础',
  },
  {
    name: '🤸 手膝爬训练',
    desc: '在宝宝前方放玩具吸引，推脚辅助',
    target: '重点训练！从匍匐爬到手膝爬',
  },
  {
    name: '🪜 扶站练习',
    desc: '扶着沙发或围栏站立',
    target: '锻炼腿部力量',
  },
  {
    name: '🔄 翻滚游戏',
    desc: '用玩具引导左右翻滚',
    target: '增强躯干灵活性',
  },
];

const LANGUAGE_TRAINING = [
  {
    name: '👶 模仿发音',
    desc: '对着宝宝发「mama」「baba」音',
    tip: '夸张口型，配合表情',
  },
  {
    name: '📚 绘本阅读',
    desc: '每天 2 次，每次 5-10 分钟',
    tip: '指着图片说名称，语速慢',
  },
  {
    name: '🎵 儿歌律动',
    desc: '播放儿歌，做简单动作',
    tip: '促进语言理解和节奏感',
  },
  {
    name: '🗣️ 描述日常',
    desc: '做什么说什么，丰富词汇',
    tip: '比如「妈妈在给宝宝换尿布」',
  },
];

const DAILY_ROUTINE = [
  { time: '06:00', act: '起床 + D3', note: '交替吃 AD/D3' },
  { time: '08:00', act: '奶 + 亲子互动', note: '趴卧练习 10 分钟' },
  { time: '10:00', act: '小睡 1 小时', note: '醒后补维生素' },
  { time: '11:30', act: '辅食 + 自由玩耍', note: '软烂粥为主' },
  { time: '14:00', act: '午睡 1.5-2 小时', note: '保证充足睡眠' },
  { time: '16:00', act: '户外活动 / 早教', note: '手膝爬训练' },
  { time: '18:00', act: '洗澡 + 碳酸钙', note: '晚上补钙' },
  { time: '20:30', act: '入睡', note: '睡前读绘本' },
];

const INIT_TASKS = [
  { id: 1, title: '完成 30 分钟手膝爬训练', done: true },
  { id: 2, title: '读 2 本绘本（语言训练）', done: false },
  { id: 3, title: '户外散步 30 分钟', done: false },
  { id: 4, title: '记录今日身高体重', done: false },
];

export default function EggBaoPage() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [input, setInput] = useState('');
  const [milestones, setMilestones] = useState(MILESTONES);

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const msDone = milestones.filter((m) => m.done).length;

  const add = () => {
    const title = input.trim();
    if (!title) return;
    setTasks((prev) => [...prev, { id: Date.now(), title, done: false }]);
    setInput('');
  };
  const toggle = (id) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const toggleMs = (id) => setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));

  return (
    <div>
      <div className="page-header">
        <h1>🍼 蛋堡的早教计划</h1>
        <p>陪伴蛋堡健康快乐成长 🌱</p>
        <div className="meta">
          <span className="tag">👶 {BABY_INFO.name}</span>
          <span className="tag warm">📅 {BABY_INFO.age}</span>
          <span className="tag">⚖️ {BABY_INFO.weight} / {BABY_INFO.height}</span>
          <span className="tag danger">⚠️ {BABY_INFO.note}</span>
        </div>
      </div>

      <div className="cards">
        <div className="card green">
          <div className="icon">🎯</div>
          <div className="label">发育里程碑</div>
          <div className="value">{msDone} / {milestones.length}</div>
        </div>
        <div className="card warm">
          <div className="icon">🧗</div>
          <div className="label">大动作训练</div>
          <div className="value">{GROSS_MOTOR.length}<span className="unit">项</span></div>
        </div>
        <div className="card">
          <div className="icon">🗣️</div>
          <div className="label">语言训练</div>
          <div className="value">{LANGUAGE_TRAINING.length}<span className="unit">项</span></div>
        </div>
        <div className="card green">
          <div className="icon">✅</div>
          <div className="label">今日任务</div>
          <div className="value">{doneCount} / {tasks.length}</div>
        </div>
      </div>

      <div className="panel warm">
        <h2>💊 今日补充剂</h2>
        <div className="timeline">
          {TODAY_SUPPLEMENTS.map((s) => (
            <div key={s.time} className={`timeline-item ${s.type === 'd3' ? 'warm' : ''}`}>
              <div className="time">{s.time}</div>
              <div className="desc">
                <strong>{s.name}</strong>
                {s.note && <span style={{ color: 'var(--muted)', marginLeft: 8 }}>· {s.note}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h2>📈 发育里程碑</h2>
          <ul className="tasks">
            {milestones.map((m) => (
              <li key={m.id} className={`task ${m.done ? 'done' : ''}`}>
                <div
                  className={`check ${m.done ? 'done' : ''}`}
                  onClick={() => toggleMs(m.id)}
                  role="checkbox"
                  aria-checked={m.done}
                >
                  {m.done ? '✓' : ''}
                </div>
                <span className="title">
                  <strong>{m.age}</strong> · {m.content}
                  {m.urgent && <span className="badge danger" style={{ marginLeft: 8 }}>重点</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel warm">
          <h2>⏰ 今日作息</h2>
          <div className="timeline">
            {DAILY_ROUTINE.map((r) => (
              <div key={r.time} className="timeline-item">
                <div className="time">{r.time}</div>
                <div className="desc">{r.act}</div>
                {r.note && <div className="note">{r.note}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>🧗 大动作训练（重点）</h2>
        <div className="item-list">
          {GROSS_MOTOR.map((g) => (
            <div key={g.name} className="item-row">
              <span className="word" style={{ minWidth: '140px' }}>{g.name}</span>
              <span className="meaning">{g.desc}</span>
              <span className="tag">{g.target}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
          💡 提示：蛋堡目前大动作稍落后，建议每天增加 10-15 分钟爬行训练，家长可以在前方用玩具吸引，同时轻轻推宝宝的脚给予辅助。
        </p>
      </div>

      <div className="panel warm">
        <h2>🗣️ 语言训练</h2>
        <div className="item-list">
          {LANGUAGE_TRAINING.map((l) => (
            <div key={l.name} className="item-row">
              <span className="word" style={{ minWidth: '130px' }}>{l.name}</span>
              <span className="meaning">{l.desc}</span>
              <span className="tag warm">💡 {l.tip}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
          💡 提示：目前蛋堡还不会说话，重点在于语言输入和模仿。每天固定时间读绘本，平时多和宝宝对话，描述正在做的事情。
        </p>
      </div>

      <div className="panel">
        <h2>📝 今日带娃任务</h2>
        <div className="row">
          <input
            type="text"
            placeholder="添加一个带娃小任务（回车提交）"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <button className="btn warm" onClick={add}>添加</button>
        </div>
        <div className="muted" style={{ marginBottom: 10 }}>
          进度 {progress}%
          <div className="progress warm"><div className="bar" style={{ width: `${progress}%` }} /></div>
        </div>
        {tasks.length === 0 ? (
          <div className="empty">还没有任务～</div>
        ) : (
          <ul className="tasks">
            {tasks.map((t) => (
              <li key={t.id} className={`task ${t.done ? 'done' : ''}`}>
                <div
                  className={`check ${t.done ? 'done' : ''}`}
                  onClick={() => toggle(t.id)}
                  role="checkbox"
                  aria-checked={t.done}
                >
                  {t.done ? '✓' : ''}
                </div>
                <span className="title">{t.title}</span>
                <button className="del" onClick={() => remove(t.id)} title="删除">✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

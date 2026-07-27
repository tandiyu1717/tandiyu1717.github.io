import { useState } from 'react';

// 视频教程
const VIDEOS = [
  {
    name: '📚 德语字母与发音入门',
    duration: '18 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1UE41147b9/',
  },
  {
    name: '🗣️ 日常问候语精讲',
    duration: '22 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1iK411577Q/',
  },
  {
    name: '📝 名词词性与冠词详解',
    duration: '35 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1Mt411g7R1/',
  },
  {
    name: '🔄 动词现在时变位规则',
    duration: '28 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1jt411f7H2/',
  },
  {
    name: '🔢 数字、时间、日期表达',
    duration: '20 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1QE41147b9/',
  },
  {
    name: '📖 A1 语法串讲总复习',
    duration: '45 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1iK411577Q/',
  },
];

// 详细教学课程
const LESSONS = [
  {
    id: 1,
    title: '德语字母表与发音',
    duration: '今日学习',
    vocab: [
      { de: 'Aa', zh: '读作 a (像英语 ah)' },
      { de: 'ä, ö, ü', zh: '三个变元音，分别像 ai/oi/ui' },
      { de: 'ß', zh: 'Eszett，发 ss 的音' },
      { de: 'ei', zh: '发 ai 音（不是单独的 e+i）' },
      { de: 'eu', zh: '发 oi 音' },
      { de: 'sch', zh: '发 sh 音' },
    ],
    grammar: '德语字母共 30 个（含 ä, ö, ü, ß）。注意：ei/ie/eu/äu 是组合元音；单词首字母大写是德语的重要特点。',
  },
  {
    id: 2,
    title: '日常问候与自我介绍',
    duration: '今日学习',
    vocab: [
      { de: 'Hallo!', zh: '你好！' },
      { de: 'Guten Morgen', zh: '早上好' },
      { de: 'Guten Tag', zh: '日安（白天）' },
      { de: 'Guten Abend', zh: '晚上好' },
      { de: 'Tschüss!', zh: '再见！' },
      { de: 'Wie heißen Sie?', zh: '您怎么称呼？' },
    ],
    grammar: '问候语使用：Sie（您，正式）/ du（你，非正式）。陌生人、长辈、商务场合一律用 Sie。例句：Ich heiße Xiao Ming.（我叫小明。）',
  },
  {
    id: 3,
    title: '名词词性与冠词',
    duration: '明日学习',
    vocab: [
      { de: 'der Tisch', zh: '桌子（阳性）' },
      { de: 'die Lampe', zh: '灯（阴性）' },
      { de: 'das Buch', zh: '书（中性）' },
      { de: 'die Bücher', zh: '书（复数）' },
    ],
    grammar: '德语名词有 3 种词性：der（阳性）/ die（阴性）/ das（中性），复数一律用 die。词性没有规律，必须连着冠词一起背！',
  },
  {
    id: 4,
    title: '动词现在时变位',
    duration: '本周学习',
    vocab: [
      { de: 'ich lerne', zh: '我学习' },
      { de: 'du lernst', zh: '你学习' },
      { de: 'er/sie lernt', zh: '他/她学习' },
      { de: 'wir lernen', zh: '我们学习' },
      { de: 'ihr lernt', zh: '你们学习' },
      { de: 'sie lernen', zh: '他们学习' },
    ],
    grammar: '规则动词变位：词根 + 词尾（-e, -st, -t, -en, -t, -en）。例：lernen（学习）→ ich lerne, du lernst, er lernt。seihen/haben/werden 是 3 个最重要的不规则动词。',
  },
];

// 每周学习计划
const WEEKLY_PLAN = [
  { day: '周一', focus: '词汇背诵', time: '30 分钟', icon: '📖' },
  { day: '周二', focus: '语法学习', time: '45 分钟', icon: '📐' },
  { day: '周三', focus: '听力练习', time: '30 分钟', icon: '🎧' },
  { day: '周四', focus: '口语跟读', time: '30 分钟', icon: '🗣️' },
  { day: '周五', focus: '阅读训练', time: '45 分钟', icon: '📚' },
  { day: '周六', focus: '综合复习', time: '1 小时', icon: '✏️' },
  { day: '周日', focus: '休息 / 看德语影视', time: '自由', icon: '🎬' },
];

// 长沙报考流程
const EXAM_STEPS = [
  {
    title: '了解考试与确定级别',
    desc: '歌德学院提供 A1-C2 多级别考试，确定自己报考 B1 级别。B1 适合已经学习约 200-350 学时的学习者。',
    tip: '建议在备考前完成至少 350 学时的德语学习',
  },
  {
    title: '关注长沙考点信息',
    desc: '长沙歌德语言中心（湖南师范大学）是本地考点。也可以选择去广州、武汉的歌德学院考点。',
    tip: '长沙考点：湖南师范大学外国语学院 · 关注官网报名开放时间',
  },
  {
    title: '注册歌德学院账号',
    desc: '访问歌德学院中国官网 goethe.de/china，注册个人账号，填写真实姓名（与身份证一致）、联系方式。',
    tip: '姓名必须与身份证完全一致，否则无法参加考试',
  },
  {
    title: '在线报名缴费',
    desc: '登录账号 → 选择「考试」→ 选择「歌德证书 B1」→ 选择长沙考点和考试日期 → 上传证件照 → 在线支付考试费。',
    tip: 'B1 考试费约 1500-1800 元（含听说读写四项），单独报名某一项约 400 元/项',
  },
  {
    title: '准备考试材料',
    desc: '身份证原件、准考证（考试前 1-2 周可在官网下载打印）、2B 铅笔、橡皮、黑色签字笔。',
    tip: '建议提前 1 周打印准考证，确认考试时间和地点',
  },
  {
    title: '参加考试',
    desc: 'B1 考试分为：听力（约 40 分钟）、阅读（65 分钟）、写作（60 分钟）、口语（约 15 分钟）。一般 1 天内完成。',
    tip: '建议提前 30 分钟到达考点，带好水和零食',
  },
  {
    title: '查询成绩与领证',
    desc: '考试后约 4-6 周可在官网查询成绩。各部分均需达到 60 分以上（满分 100）方为通过。',
    tip: '证书可在长沙考点现场领取，或选择邮寄（邮费到付）',
  },
];

const EXAM_FEES = [
  { item: 'B1 完整考试', price: '¥ 1,500 - 1,800', note: '听说读写四项' },
  { item: '单项补考', price: '¥ 400 - 500 / 项', note: '未通过部分可单独补考' },
  { item: '教材资料费', price: '¥ 200 - 500', note: '备考教材 + 模拟题' },
  { item: '总预算参考', price: '¥ 2,000 - 2,500', note: '首次报名 + 教材' },
];

// 模拟考试历史
const MOCK_HISTORY = [
  { date: '07-15', parts: { listening: 65, reading: 72, writing: 58, speaking: 70 }, total: 66 },
  { date: '07-22', parts: { listening: 70, reading: 75, writing: 65, speaking: 72 }, total: 70 },
  { date: '07-27', parts: { listening: null, reading: null, writing: null, speaking: null }, total: null, upcoming: true },
];

// 打卡日历（7 月示例）
const CHECKIN_DAYS = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const today = 27;
  if (day < today) {
    // 已过去的天，部分已打卡
    return { day, done: day % 7 !== 0 && day % 6 !== 0, isToday: false };
  }
  if (day === today) return { day, done: false, isToday: true };
  return { day, done: false, isToday: false };
});

const RESOURCES = [
  { name: '德语助手', type: '词典', desc: '查词、变位、例句全覆盖' },
  { name: '每日德语听力', type: '听力', desc: '海量音频资源，分级训练' },
  { name: 'Memrise', type: '背词', desc: '科学记忆曲线，轻松记单词' },
  { name: 'Duden', type: '语法', desc: '德语权威词典和语法指南' },
  { name: 'DW Learn German', type: '系统课', desc: '德国之声免费德语课' },
  { name: '沪江德语', type: '综合', desc: '中文讲解，适合入门' },
];

export default function GermanPage() {
  const [activeTab, setActiveTab] = useState('today');
  const [tasks, setTasks] = useState([
    { id: 1, title: '背诵 20 个 A1 单词', done: true },
    { id: 2, title: '观看「名词词性」教学视频', done: false },
    { id: 3, title: '跟读 5 分钟德语听力', done: false },
    { id: 4, title: '整理本周错题', done: false },
  ]);
  const [input, setInput] = useState('');

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  // 打卡统计
  const checkedDays = CHECKIN_DAYS.filter((d) => d.done).length;
  const monthDays = CHECKIN_DAYS.length;
  const checkinRate = Math.round((checkedDays / monthDays) * 100);

  // 模拟考试数据
  const latestMock = MOCK_HISTORY.find((m) => m.total !== null);
  const upcomingMock = MOCK_HISTORY.find((m) => m.upcoming);

  const add = () => {
    const title = input.trim();
    if (!title) return;
    setTasks((prev) => [...prev, { id: Date.now(), title, done: false }]);
    setInput('');
  };
  const toggle = (id) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const openVideo = (link) => window.open(link, '_blank');

  const todayLesson = LESSONS[0];

  return (
    <div>
      <div className="page-header">
        <h1>📖 德语学习</h1>
        <p>零基础 → B1 考试，目标 2028 年上半年完成！💪</p>
        <div className="meta">
          <span className="tag">📅 计划 19 个月</span>
          <span className="tag warm">🎯 目标 B1</span>
          <span className="tag">📍 当前 A1 入门</span>
          <span className="tag">🌆 长沙考点</span>
        </div>
      </div>

      <div className="cards">
        <div className="card green">
          <div className="icon">🔥</div>
          <div className="label">本月打卡</div>
          <div className="value">{checkedDays}<span className="unit">/ {monthDays} 天</span></div>
        </div>
        <div className="card warm">
          <div className="icon">📊</div>
          <div className="label">打卡率</div>
          <div className="value">{checkinRate}<span className="unit">%</span></div>
        </div>
        <div className="card">
          <div className="icon">📝</div>
          <div className="label">最近模考</div>
          <div className="value">{latestMock ? latestMock.total : '—'}<span className="unit">分</span></div>
        </div>
        <div className="card green">
          <div className="icon">✅</div>
          <div className="label">今日任务</div>
          <div className="value">{doneCount}/{tasks.length}</div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>📅 今日学习</button>
        <button className={`tab ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>🎬 视频教程</button>
        <button className={`tab ${activeTab === 'mock' ? 'active' : ''}`} onClick={() => setActiveTab('mock')}>📝 模拟考试</button>
        <button className={`tab ${activeTab === 'exam' ? 'active' : ''}`} onClick={() => setActiveTab('exam')}>🎯 长沙报考</button>
      </div>

      {/* 今日学习 */}
      {activeTab === 'today' && (
        <>
          <div className="panel">
            <h2>📅 今日打卡日历</h2>
            <div className="checkin-stats">
              <div className="stat">🔥 已打卡 <strong>{checkedDays}</strong> 天</div>
              <div className="stat">📊 本月打卡率 <strong>{checkinRate}%</strong></div>
              <div className="stat">🎯 目标 <strong>25 天 / 月</strong></div>
            </div>
            <div className="checkin-grid">
              {CHECKIN_DAYS.map((d) => (
                <div
                  key={d.day}
                  className={`checkin-day ${d.done ? 'done' : ''} ${d.isToday ? 'today' : ''}`}
                  title={d.isToday ? '今天' : ''}
                >
                  <span className="num">{d.day}</span>
                </div>
              ))}
            </div>
            <p className="muted">点击任意日期可补打卡 · 绿色=已打卡 · 加粗边框=今天</p>
          </div>

          <div className="panel warm">
            <h2>📚 今日教学：{todayLesson.title}</h2>
            <div className="lesson">
              <div className="lesson-head">
                <span className="num">{todayLesson.id}</span>
                <span className="title">{todayLesson.title}</span>
                <span className="duration">{todayLesson.duration}</span>
              </div>
              <div className="section-title" style={{ marginBottom: 8 }}>📖 重点词汇</div>
              {todayLesson.vocab.map((v) => (
                <div key={v.de} className="vocab-row">
                  <span className="de">{v.de}</span>
                  <span className="zh">{v.zh}</span>
                </div>
              ))}
              <div className="grammar">
                <strong>📐 语法要点：</strong>{todayLesson.grammar}
              </div>
            </div>
          </div>

          <div className="panel">
            <h2>📝 今日学习任务</h2>
            <div className="row">
              <input
                type="text"
                placeholder="添加一个学习任务（回车提交）"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && add()}
              />
              <button className="btn" onClick={add}>添加</button>
            </div>
            <div className="muted" style={{ marginBottom: 10 }}>
              进度 {progress}%
              <div className="progress"><div className="bar" style={{ width: `${progress}%` }} /></div>
            </div>
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
          </div>

          <div className="panel warm">
            <h2>📅 每周学习计划</h2>
            <div className="item-list">
              {WEEKLY_PLAN.map((day) => (
                <div key={day.day} className="item-row">
                  <span className="word" style={{ minWidth: '50px' }}>{day.icon} {day.day}</span>
                  <span className="meaning">{day.focus}</span>
                  <span className="tag warm">{day.time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 视频教程 */}
      {activeTab === 'video' && (
        <>
          <div className="panel">
            <h2>🎬 视频教程（点击观看）</h2>
            <div className="item-list">
              {VIDEOS.map((v) => (
                <div
                  key={v.name}
                  className="video-card"
                  onClick={() => openVideo(v.link)}
                >
                  <div className="thumb">▶️</div>
                  <div className="info">
                    <div className="title">{v.name}</div>
                    <div className="duration">{v.duration} · {v.level}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="muted" style={{ marginTop: 12 }}>
              💡 建议按顺序学习，每看完一节做对应练习巩固。
            </p>
          </div>

          <div className="panel warm">
            <h2>📚 详细教学课程</h2>
            {LESSONS.map((lesson) => (
              <div key={lesson.id} className="lesson">
                <div className="lesson-head">
                  <span className="num">{lesson.id}</span>
                  <span className="title">{lesson.title}</span>
                  <span className="duration">{lesson.duration}</span>
                </div>
                <div className="section-title" style={{ marginBottom: 8 }}>📖 重点词汇</div>
                {lesson.vocab.map((v) => (
                  <div key={v.de} className="vocab-row">
                    <span className="de">{v.de}</span>
                    <span className="zh">{v.zh}</span>
                  </div>
                ))}
                <div className="grammar">
                  <strong>📐 语法要点：</strong>{lesson.grammar}
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <h2>🎯 推荐学习资源</h2>
            <div className="item-list">
              {RESOURCES.map((r) => (
                <div key={r.name} className="item-row">
                  <span className="word">{r.name}</span>
                  <span className="meaning">{r.desc}</span>
                  <span className="tag">{r.type}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 模拟考试 */}
      {activeTab === 'mock' && (
        <>
          <div className="panel">
            <h2>📝 模拟考试安排</h2>
            <div className="mock-exam">
              <div className="head">
                <span className="emoji">🎯</span>
                <span className="title">下次模考</span>
                <span className="next">{upcomingMock ? `📅 ${upcomingMock.date}` : '暂无安排'}</span>
              </div>
              <p style={{ margin: '8px 0', color: 'var(--text-soft)', fontSize: 14 }}>
                每周一次完整模拟考试，按真实考试节奏进行，训练考试状态。
              </p>
              <button className="btn" style={{ marginTop: 8 }}>📅 开始今日模考</button>
            </div>
          </div>

          <div className="panel warm">
            <h2>📊 最近一次模考成绩</h2>
            {latestMock && (
              <>
                <div className="muted" style={{ marginBottom: 12 }}>考试日期：{latestMock.date} · 总分 {latestMock.total} 分</div>
                <div className="mock-exam" style={{ background: 'var(--surface)' }}>
                  <div className="parts">
                    <div className="part">
                      <div className="name">🎧 听力</div>
                      <div className={`score ${latestMock.parts.listening < 60 ? 'warn' : ''}`}>{latestMock.parts.listening}</div>
                    </div>
                    <div className="part">
                      <div className="name">📖 阅读</div>
                      <div className={`score ${latestMock.parts.reading < 60 ? 'warn' : ''}`}>{latestMock.parts.reading}</div>
                    </div>
                    <div className="part">
                      <div className="name">✍️ 写作</div>
                      <div className={`score ${latestMock.parts.writing < 60 ? 'warn' : ''}`}>{latestMock.parts.writing}</div>
                    </div>
                    <div className="part">
                      <div className="name">🗣️ 口语</div>
                      <div className={`score ${latestMock.parts.speaking < 60 ? 'warn' : ''}`}>{latestMock.parts.speaking}</div>
                    </div>
                  </div>
                </div>
                <p style={{ marginTop: 12, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
                  💡 写作部分分数偏低，建议加强写作模板背诵和语法练习。
                </p>
              </>
            )}
          </div>

          <div className="panel">
            <h2>📈 模考历史记录</h2>
            <div className="item-list">
              {MOCK_HISTORY.map((m) => (
                <div key={m.date} className="item-row">
                  <span className="word" style={{ minWidth: '80px' }}>📅 {m.date}</span>
                  <span className="meaning">
                    {m.upcoming ? '⏳ 即将开考' : `总分 ${m.total} 分 · 听${m.parts.listening} / 读${m.parts.reading} / 写${m.parts.writing} / 说${m.parts.speaking}`}
                  </span>
                  <span className={`tag ${m.upcoming ? 'warm' : ''}`}>
                    {m.upcoming ? '未考' : m.total >= 60 ? '✅ 通过' : '⚠️ 待提升'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel warm">
            <h2>🎯 模考训练计划</h2>
            <div className="item-list">
              <div className="item-row">
                <span className="word" style={{ minWidth: '120px' }}>📅 每周一</span>
                <span className="meaning">完整模拟考试（4 部分）</span>
                <span className="tag warm">2 小时</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '120px' }}>🎧 每周三</span>
                <span className="meaning">听力专项训练</span>
                <span className="tag warm">40 分钟</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '120px' }}>✍️ 每周五</span>
                <span className="meaning">写作训练 + 老师批改</span>
                <span className="tag warm">60 分钟</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '120px' }}>🗣️ 每周日</span>
                <span className="meaning">口语模拟 + 录音复盘</span>
                <span className="tag warm">30 分钟</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 长沙报考 */}
      {activeTab === 'exam' && (
        <>
          <div className="panel">
            <h2>📋 长沙报考流程</h2>
            <div className="exam-steps">
              {EXAM_STEPS.map((step, i) => (
                <div key={i} className={`exam-step ${i >= 4 ? 'warm' : ''}`}>
                  <div className="step-num">{i + 1}</div>
                  <div className="step-content">
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                    {step.tip && <div className="step-tip">💡 {step.tip}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel warm">
            <h2>💰 考试费用参考</h2>
            <div className="item-list">
              {EXAM_FEES.map((f) => (
                <div key={f.item} className="item-row">
                  <span className="word" style={{ minWidth: '140px' }}>{f.item}</span>
                  <span className="meaning">{f.note}</span>
                  <span className="tag warm">{f.price}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 12, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
              💡 费用仅供参考，实际以歌德学院官网公布为准。长沙考点价格通常与全国统一价一致。
            </p>
          </div>

          <div className="panel">
            <h2>🏢 长沙及周边考点信息</h2>
            <div className="item-list">
              <div className="item-row">
                <span className="word" style={{ minWidth: '180px' }}>🏫 长沙歌德语言中心</span>
                <span className="meaning">湖南师范大学外国语学院</span>
                <span className="tag">📍 本地</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '180px' }}>🏫 广州歌德学院</span>
                <span className="meaning">华南理工大学 · 距长沙约 2 小时高铁</span>
                <span className="tag warm">🚄 备选</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '180px' }}>🏫 武汉歌德语言中心</span>
                <span className="meaning">武汉大学 · 距长沙约 1.5 小时高铁</span>
                <span className="tag warm">🚄 备选</span>
              </div>
            </div>
            <p style={{ marginTop: 12, color: 'var(--text-soft)', fontSize: 13 }}>
              💡 建议优先选择长沙本地考点，考试场次较少可考虑广州/武汉作为备选。
            </p>
          </div>

          <div className="panel warm">
            <h2>📊 B1 考试基本信息</h2>
            <div className="exam-info">
              <h3>🎓 歌德学院 B1 证书</h3>
              <div className="item">
                <span className="label">考试时长</span>
                <span className="value">约 3 小时 15 分钟</span>
              </div>
              <div className="item">
                <span className="label">考试部分</span>
                <span className="value">🎧 听力 · 📖 阅读 · ✍️ 写作 · 🗣️ 口语</span>
              </div>
              <div className="item">
                <span className="label">及格分数</span>
                <span className="value">各部分 ≥ 60 分（满分 100）</span>
              </div>
              <div className="item">
                <span className="label">证书有效期</span>
                <span className="value">终身有效</span>
              </div>
              <div className="item">
                <span className="label">考试频次</span>
                <span className="value">长沙约每年 4-6 次</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { dailySeed } from '../utils.js';

const LESSON_STATE_KEY = 'german_lesson_state_v1';
const LESSON_DONE_KEY = 'german_lesson_done_v1';
const TODAY_STATE_KEY = 'german_today_state_v1';

// 视频教程库（带进度记录）
const VIDEOS = [
  {
    id: 'v01',
    title: '德语字母发音',
    duration: '12 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1QE41147b9/',
    desc: '德语 26 个字母 + 4 个特殊字母的标准发音',
  },
  {
    id: 'v02',
    title: '德语问候语',
    duration: '10 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1iK411577Q/',
    desc: 'Guten Tag / Hallo / Tschüss 等基础问候',
  },
  {
    id: 'v03',
    title: '德语名词词性',
    duration: '15 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1Mt411g7R1/',
    desc: 'der / die / das 三性的判断与记忆',
  },
  {
    id: 'v04',
    title: '德语动词变位',
    duration: '18 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1jt411f7H2/',
    desc: '现在时规则动词变位 sein/haben',
  },
  {
    id: 'v05',
    title: '德语数字与时间',
    duration: '14 分钟',
    level: 'A1',
    link: 'https://www.bilibili.com/video/BV1QE41147b9/',
    desc: '1-100 数字表达、时间表达',
  },
  {
    id: 'v06',
    title: '日常对话场景',
    duration: '20 分钟',
    level: 'A2',
    link: 'https://www.bilibili.com/video/BV1iK411577Q/',
    desc: '购物、点餐、问路等场景对话',
  },
];

// 每日教学课程库
const LESSONS = [
  { id: 'l01', title: '第 1 课：发音入门', points: ['字母 ä ö ü 的发音', '辅音组合 sch / ch / sp', '长音与短音的区分'] },
  { id: 'l02', title: '第 2 课：基础问候', points: ['正式与非正式问候', 'Guten Morgen / Tag / Abend', '自我介绍 Ich heiße...'] },
  { id: 'l03', title: '第 3 课：人称代词', points: ['ich / du / er / sie / es', 'wir / ihr / sie / Sie', '尊称 Sie 的使用场合'] },
  { id: 'l04', title: '第 4 课：动词 sein', points: ['sein 的现在时变位', 'ich bin / du bist / er ist', '国籍与职业表达'] },
  { id: 'l05', title: '第 5 课：动词 haben', points: ['haben 的现在时变位', '表达拥有', '年龄表达'] },
  { id: 'l06', title: '第 6 课：名词词性', points: ['der / die / das 三性', '词性记忆规律', '常见例外'] },
  { id: 'l07', title: '第 7 课：不定冠词', points: ['ein / eine / ein', '否定词 kein', '与定冠词对比'] },
  { id: 'l08', title: '第 8 课：数字 1-20', points: ['基础数字拼写', '电话号码表达', '11-12 的特殊形式'] },
];

// 每日重难点笔记库（轮换）
const DAILY_NOTES = [
  {
    title: '今日重点：发音',
    keyPoints: [
      { topic: '难点 1', content: 'ö 的发音：先发 e 音，然后保持舌位，嘴唇收圆' },
      { topic: '难点 2', content: 'ü 的发音：先发 i 音，然后保持舌位，嘴唇收圆' },
      { topic: '难点 3', content: 'ch 在元音 a/o/u 后发喉音，其他情况下发软音' },
    ],
    practice: '反复练习 "schön" "über" "Buch" "ich" 的发音',
  },
  {
    title: '今日重点：动词变位',
    keyPoints: [
      { topic: '难点 1', content: 'sein 是不规则动词：ich bin, du bist, er ist' },
      { topic: '难点 2', content: 'haben 的 du 形式是 hast，不是 habst' },
      { topic: '难点 3', content: '动词词干加 -e, -st, -t, -en, -t, -en 的规则' },
    ],
    practice: '写出 sein 和 haben 的完整变位表',
  },
  {
    title: '今日重点：词性记忆',
    keyPoints: [
      { topic: '难点 1', content: '以 -ung 结尾的名词都是 die（阴性）' },
      { topic: '难点 2', content: '以 -er 结尾的名词多为 der（阳性），但不是绝对' },
      { topic: '难点 3', content: '以 -chen / -lein 结尾的都是 das（中性）' },
    ],
    practice: '记忆 10 个常见名词词性',
  },
  {
    title: '今日重点：句子结构',
    keyPoints: [
      { topic: '难点 1', content: '陈述句：动词永远在第二位' },
      { topic: '难点 2', content: '疑问句：疑问词开头，动词紧随其后' },
      { topic: '难点 3', content: '时间/地点状语放在动词之后' },
    ],
    practice: '造 5 个简单句子，注意动词位置',
  },
  {
    title: '今日重点：格的变化',
    keyPoints: [
      { topic: '难点 1', content: '第一格作主语：der Mann kommt' },
      { topic: '难点 2', content: '第四格作宾语：ich sehe den Mann' },
      { topic: '难点 3', content: '阳性第四格 der → den，其他词性不变' },
    ],
    practice: '练习把 der/die/das 变成第四格',
  },
  {
    title: '今日重点：情态动词',
    keyPoints: [
      { topic: '难点 1', content: 'können 表示能力：Ich kann Deutsch sprechen' },
      { topic: '难点 2', content: 'müssen 表示必须：Ich muss lernen' },
      { topic: '难点 3', content: '情态动词 + 动词原形（原形放句末）' },
    ],
    practice: '用 können 造 3 个句子',
  },
];

// 模拟考试题目库
const MOCK_QUESTIONS = {
  reading: [
    {
      q: '阅读理解：Tom ist 25 Jahre alt. Er kommt aus Deutschland. Er wohnt in Berlin. Was ist richtig?',
      options: ['Tom kommt aus Berlin', 'Tom ist 25 Jahre alt', 'Tom wohnt in Deutschland und Österreich', 'Tom ist 30 Jahre alt'],
      answer: 1,
      explain: '原文明确说 "Tom ist 25 Jahre alt"，其他选项均与原文不符',
    },
    {
      q: '阅读理解：Anna geht gerne einkaufen. Sie kauft jeden Samstag neue Kleidung. Was macht Anna gern?',
      options: ['Sie kauft gern ein', 'Sie liest gern Bücher', 'Sie schwimmt gern', 'Sie kocht gern'],
      answer: 0,
      explain: '"Anna geht gerne einkaufen" 说明她喜欢购物',
    },
    {
      q: '阅读理解：Das Wetter ist heute schön. Die Sonne scheint. Wir gehen in den Park. Warum gehen wir in den Park?',
      options: ['Es regnet', 'Die Sonne scheint', 'Es ist kalt', 'Wir bleiben zu Hause'],
      answer: 1,
      explain: '因为天气好、出太阳，所以去公园',
    },
  ],
  listening: [
    {
      q: '听力题：Hallo, ich heiße Maria. Ich bin 20 Jahre alt. Ich komme aus Österreich. Wie alt ist Maria?',
      options: ['18', '20', '22', '25'],
      answer: 1,
      explain: 'Maria 说 "Ich bin 20 Jahre alt"',
    },
    {
      q: '听力题：Heute ist Montag. Ich muss um 7 Uhr aufstehen. Wann steht die Person auf?',
      options: ['6 Uhr', '7 Uhr', '8 Uhr', '9 Uhr'],
      answer: 1,
      explain: '"Ich muss um 7 Uhr aufstehen" - 7 点起床',
    },
    {
      q: '听力题：Ich trinke morgens immer Kaffee, aber keinen Tee. Was trinkt die Person morgens?',
      options: ['Tee', 'Kaffee', 'Milch', 'Wasser'],
      answer: 1,
      explain: '"Ich trinke morgens immer Kaffee" - 早上喝咖啡',
    },
  ],
  grammar: [
    {
      q: '语法题：___ ist das? — Das ist mein Buch.',
      options: ['Was', 'Wer', 'Wo', 'Wie'],
      answer: 0,
      explain: '问 "这是什么"，用 Was',
    },
    {
      q: '语法题：Ich ___ Student.',
      options: ['bin', 'bist', 'ist', 'sind'],
      answer: 0,
      explain: '主语 ich 用 bin',
    },
    {
      q: '语法题：Wir haben ___ Hund.',
      options: ['ein', 'eine', 'einen', 'einer'],
      answer: 2,
      explain: 'Hund 是阳性，第四格用 einen',
    },
    {
      q: '语法题：Das Buch ist ___.',
      options: ['interessant', 'interessante', 'interessanter', 'interessantes'],
      answer: 0,
      explain: 'sein 后接形容词作表语，用原级',
    },
    {
      q: '语法题：___ Uhr ist es jetzt?',
      options: ['Was', 'Wie viel', 'Welche', 'Wo'],
      answer: 1,
      explain: '问时间用 Wie viel Uhr',
    },
  ],
  writing: [
    {
      q: '写作题：请用 5 句话介绍你自己（姓名、年龄、国籍、职业、爱好）',
      type: 'open',
      reference: '参考答案：Ich heiße [名字]. Ich bin [年龄] Jahre alt. Ich komme aus China. Ich bin Studentin. Meine Hobbys sind Lesen und Reisen.',
    },
    {
      q: '写作题：描述你的今天早上做了什么（用过去时 Perfekt）',
      type: 'open',
      reference: '参考答案：Heute Morgen bin ich um 7 Uhr aufgestanden. Ich habe gefrühstückt. Dann bin ich zur Schule gegangen.',
    },
  ],
};

const WEEKLY_PLAN = [
  { week: 1, content: '发音入门 + 字母 + 数字', target: '掌握 26 个字母发音' },
  { week: 2, content: '问候语 + 人称代词 + sein', target: '能自我介绍' },
  { week: 3, content: 'haben + 名词词性 + 不定冠词', target: '能描述物品' },
  { week: 4, content: '数字 + 时间 + 日期', target: '能问时间日期' },
  { week: 5, content: '动词变位 + 句子结构', target: '能造简单句' },
  { week: 6, content: '情态动词 + 日常对话', target: '能进行简单对话' },
];

const EXAM_STEPS = [
  { title: '注册 Goethe Institut 账号', desc: '访问歌德学院官网，注册个人账号', tip: '长沙考点：湖南师范大学歌德语言中心' },
  { title: '选择考试等级和场次', desc: '选择 B1 等级，查看可报考的场次', tip: 'B1 考试一般每年 3 月、6 月、11 月' },
  { title: '在线缴费', desc: '通过支付宝或银行卡在线支付考试费', tip: 'B1 考试费约 ¥1500-1800' },
  { title: '收到确认邮件', desc: '缴费后会收到考试确认邮件和准考证', tip: '请保存好确认邮件' },
  { title: '打印准考证', desc: '考前 1 周登录系统打印准考证', tip: '准考证+身份证必备' },
  { title: '参加考试', desc: '考试当天提前 30 分钟到达考点', tip: '带身份证、准考证、2B 铅笔' },
  { title: '查询成绩', desc: '考后 4-6 周可登录系统查询成绩', tip: 'B1 各项需达到 60 分以上' },
];

export default function GermanPage() {
  const [activeTab, setActiveTab] = useState('today');

  // 打卡记录（从0开始）
  const [checkinDays, setCheckinDays] = useState(() => {
    try {
      const saved = localStorage.getItem('german_checkin');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try { localStorage.setItem('german_checkin', JSON.stringify([...checkinDays])); } catch {}
  }, [checkinDays]);

  const today = new Date().toISOString().slice(0, 10);

  // 当前正在学习的课程索引（持久化，默认第 0 课 = 第 1 课）
  const [currentLessonIndex, setCurrentLessonIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(LESSON_STATE_KEY);
      const idx = saved !== null ? parseInt(saved, 10) : 0;
      return Number.isNaN(idx) || idx < 0 ? 0 : idx;
    } catch { return 0; }
  });
  useEffect(() => {
    try { localStorage.setItem(LESSON_STATE_KEY, String(currentLessonIndex)); } catch {}
  }, [currentLessonIndex]);

  // 已完成的课程集合
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem(LESSON_DONE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  useEffect(() => {
    try { localStorage.setItem(LESSON_DONE_KEY, JSON.stringify([...completedLessons])); } catch {}
  }, [completedLessons]);

  // 今日打卡时的课程推进快照（按日期区分，过夜失效）
  // advanced = true 表示今天打卡时推进过课程，prevIndex = 推进前的课程索引（用于取消打卡时回退）
  const [todayCheckinState, setTodayCheckinState] = useState(() => {
    try {
      const saved = localStorage.getItem(TODAY_STATE_KEY);
      if (!saved) return { date: '', advanced: false, prevIndex: 0 };
      const parsed = JSON.parse(saved);
      if (parsed.date !== today) return { date: today, advanced: false, prevIndex: 0 };
      return parsed;
    } catch { return { date: today, advanced: false, prevIndex: 0 }; }
  });
  useEffect(() => {
    try { localStorage.setItem(TODAY_STATE_KEY, JSON.stringify({ ...todayCheckinState, date: today })); } catch {}
  }, [todayCheckinState, today]);

  // 打卡 = 完成当前课并推进到下一课；取消打卡 = 回退到上一课
  const toggleCheckin = () => {
    const wasCheckedIn = checkinDays.has(today);

    if (!wasCheckedIn) {
      // 打卡：完成当前课，推进到下一课
      const prevIdx = currentLessonIndex;
      setCheckinDays((prev) => new Set(prev).add(today));
      setCompletedLessons((cs) => new Set(cs).add(prevIdx));
      // 已是最后一课时不再推进，但仍标记完成
      if (prevIdx < LESSONS.length - 1) {
        setCurrentLessonIndex(prevIdx + 1);
      }
      setTodayCheckinState({ date: today, advanced: true, prevIndex: prevIdx });
    } else {
      // 取消打卡：如果今天打卡时推进过课程，回退到上一课
      setCheckinDays((prev) => {
        const next = new Set(prev);
        next.delete(today);
        return next;
      });
      if (todayCheckinState.advanced) {
        const prevIdx = todayCheckinState.prevIndex;
        setCurrentLessonIndex(prevIdx);
        setCompletedLessons((cs) => {
          const next = new Set(cs);
          next.delete(prevIdx);
          return next;
        });
      }
      setTodayCheckinState({ date: today, advanced: false, prevIndex: 0 });
    }
  };
  const isCheckedIn = checkinDays.has(today);

  // 是否所有课程都已学完（用于提示）
  const allLessonsDone = currentLessonIndex >= LESSONS.length - 1 && completedLessons.has(LESSONS.length - 1);

  // 视频进度记录
  const [videoProgress, setVideoProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('german_video_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try { localStorage.setItem('german_video_progress', JSON.stringify(videoProgress)); } catch {}
  }, [videoProgress]);

  const [expandedVideo, setExpandedVideo] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const updateProgress = (videoId, status) => {
    setVideoProgress((prev) => ({
      ...prev,
      [videoId]: status === 'clear' ? undefined : { status, updated: new Date().toISOString() },
    }));
  };

  const todayLesson = LESSONS[currentLessonIndex] || LESSONS[0];
  const todayNote = DAILY_NOTES[dailySeed(DAILY_NOTES.length, 2)];
  const lessonProgress = Math.round((completedLessons.size / LESSONS.length) * 100);

  // 模拟考试答题状态
  const [mockAnswers, setMockAnswers] = useState({});
  const [mockSubmitted, setMockSubmitted] = useState(false);

  const answerQuestion = (section, qIndex, optionIndex) => {
    if (mockSubmitted) return;
    setMockAnswers((prev) => ({ ...prev, [`${section}-${qIndex}`]: optionIndex }));
  };

  const submitMock = () => setMockSubmitted(true);
  const resetMock = () => {
    setMockAnswers({});
    setMockSubmitted(false);
  };

  const objectiveQuestions = [
    ...MOCK_QUESTIONS.reading.map((q, i) => ({ ...q, section: 'reading', qIndex: i })),
    ...MOCK_QUESTIONS.listening.map((q, i) => ({ ...q, section: 'listening', qIndex: i })),
    ...MOCK_QUESTIONS.grammar.map((q, i) => ({ ...q, section: 'grammar', qIndex: i })),
  ];

  const correctCount = objectiveQuestions.filter(
    (q) => mockAnswers[`${q.section}-${q.qIndex}`] === q.answer
  ).length;
  const mockScore = Math.round((correctCount / objectiveQuestions.length) * 100);

  return (
    <div>
      <div className="page-header">
        <h1>📖 德语学习</h1>
        <p>零基础 → B1 自学计划，目标 2028 年上半年考试 🎯</p>
        <div className="meta">
          <span className="tag">📚 零基础</span>
          <span className="tag warm">🎯 目标 B1</span>
          <span className="tag">📍 长沙</span>
          <span className="tag">✅ 已打卡 {checkinDays.size} 天</span>
          <span className="tag warm">📖 第 {currentLessonIndex + 1} / {LESSONS.length} 课</span>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>📅 今日学习</button>
        <button className={`tab ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>🎬 视频教程</button>
        <button className={`tab ${activeTab === 'mock' ? 'active' : ''}`} onClick={() => setActiveTab('mock')}>📝 模拟考试</button>
        <button className={`tab ${activeTab === 'exam' ? 'active' : ''}`} onClick={() => setActiveTab('exam')}>🎯 长沙报考</button>
      </div>

      {activeTab === 'today' && (
        <>
          {/* 每日打卡 */}
          <div className="panel">
            <h2>📅 今日打卡</h2>
            <div className="checkin-area">
              <button
                className={`checkin-btn ${isCheckedIn ? 'done' : ''}`}
                onClick={toggleCheckin}
              >
                {isCheckedIn ? '✓ 今日已打卡（已推进课程）' : '🔘 点击打卡完成当前课'}
              </button>
              <div className="checkin-stats">
                <div className="stat-item">
                  <div className="stat-value">{checkinDays.size}</div>
                  <div className="stat-label">累计打卡</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{isCheckedIn ? '1' : '0'}</div>
                  <div className="stat-label">今日</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{completedLessons.size}/{LESSONS.length}</div>
                  <div className="stat-label">已学完</div>
                </div>
              </div>
            </div>
            <div className="muted" style={{ marginTop: 10, fontSize: 12, lineHeight: 1.6 }}>
              💡 课程进度与打卡绑定：<strong style={{ color: 'var(--primary-strong)' }}>打卡后会自动完成当前课并推进到下一课</strong>，没打卡就一直停留在当前课。取消今日打卡会回退到上一课。
            </div>
          </div>

          {/* 今日课程 */}
          <div className="panel warm">
            <h2>📚 今日课程 <span className="lesson-progress-tag">第 {currentLessonIndex + 1} / {LESSONS.length} 课</span></h2>
            <div className="lesson-progress-bar">
              <div className="progress"><div className="bar" style={{ width: `${lessonProgress}%` }} /></div>
              <span className="muted" style={{ fontSize: 12 }}>已学完 {completedLessons.size} 课 · 进度 {lessonProgress}%</span>
            </div>
            {allLessonsDone ? (
              <div className="lesson-card" style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
                <div className="lesson-title" style={{ justifyContent: 'center' }}>所有课程已学完！</div>
                <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
                  可以进入"模拟考试"或"长沙报考"页签检验学习成果
                </div>
              </div>
            ) : (
              <div className="lesson-card">
                <div className="lesson-title">{todayLesson.title}</div>
                <div className="lesson-section">重难点</div>
                <ul className="lesson-points">
                  {todayLesson.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                {!isCheckedIn && (
                  <div className="lesson-cta">👆 完成今日打卡后会自动推进到下一课</div>
                )}
              </div>
            )}
          </div>

          {/* 每日重难点笔记 */}
          <div className="panel">
            <h2>✍️ 今日重难点笔记</h2>
            <div className="note-card">
              <div className="note-title">{todayNote.title}</div>
              {todayNote.keyPoints.map((kp, i) => (
                <div key={i} className="note-point">
                  <div className="note-topic">{kp.topic}</div>
                  <div className="note-content">{kp.content}</div>
                </div>
              ))}
              <div className="note-practice">🎯 练习：{todayNote.practice}</div>
            </div>
          </div>

          {/* 学习计划 */}
          <div className="panel warm">
            <h2>📊 6 周学习计划</h2>
            <div className="weekly-plan">
              {WEEKLY_PLAN.map((w) => (
                <div key={w.week} className="week-item">
                  <div className="week-num">第 {w.week} 周</div>
                  <div className="week-content">
                    <div className="week-text">{w.content}</div>
                    <div className="week-target">🎯 {w.target}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'video' && (
        <>
          <div className="panel">
            <h2>🎬 视频教程</h2>
            <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
              自动记录观看进度，已看完的视频会自动折叠隐藏
            </p>
            <button
              className={`btn ghost ${showCompleted ? 'active' : ''}`}
              onClick={() => setShowCompleted((v) => !v)}
              style={{ marginBottom: 14 }}
            >
              {showCompleted ? '🙈 隐藏已看完' : '👁️ 显示已看完'}
            </button>

            <div className="video-list">
              {VIDEOS.map((video) => {
                const progress = videoProgress[video.id];
                const isDone = progress?.status === 'done';
                if (isDone && !showCompleted) return null;
                return (
                  <div key={video.id} className={`video-item ${isDone ? 'completed' : ''}`}>
                    <div className="video-item-head" onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)}>
                      <span className="video-status">
                        {isDone ? '✅' : progress?.status === 'watching' ? '▶️' : '⬜'}
                      </span>
                      <span className="video-title-text">{video.title}</span>
                      <span className="video-level">{video.level}</span>
                      <span className="video-duration">{video.duration}</span>
                      <span className="video-expand">{expandedVideo === video.id ? '▲' : '▼'}</span>
                    </div>
                    {expandedVideo === video.id && (
                      <div className="video-detail">
                        <p className="video-desc">{video.desc}</p>
                        <a className="song-link" href={video.link} target="_blank" rel="noopener noreferrer">
                          ▶️ 打开观看
                        </a>
                        <div className="video-actions">
                          {!isDone && (
                            <>
                              <button className="btn ghost" onClick={() => updateProgress(video.id, 'watching')}>
                                📌 标记"在看"
                              </button>
                              <button className="btn" onClick={() => updateProgress(video.id, 'done')}>
                                ✅ 标记"已看完"
                              </button>
                            </>
                          )}
                          {isDone && (
                            <button className="btn ghost" onClick={() => updateProgress(video.id, 'clear')}>
                              ↩️ 重新标记未完成
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {activeTab === 'mock' && (
        <>
          <div className="panel">
            <h2>📝 模拟考试</h2>
            <p className="muted" style={{ marginTop: 0, marginBottom: 14 }}>
              共 {objectiveQuestions.length} 道客观题 + {MOCK_QUESTIONS.writing.length} 道写作题，做完点击"提交"查看成绩
            </p>

            {mockSubmitted && (
              <div className="mock-result">
                <div className="mock-score">得分：{mockScore} 分</div>
                <div className="mock-stat">正确 {correctCount} / {objectiveQuestions.length}</div>
                <button className="btn" onClick={resetMock}>🔄 重新测试</button>
              </div>
            )}

            {/* 阅读理解 */}
            <div className="mock-section">
              <h3>📖 阅读理解（{MOCK_QUESTIONS.reading.length} 题）</h3>
              {MOCK_QUESTIONS.reading.map((q, i) => (
                <div key={i} className="mock-question">
                  <div className="q-text">{i + 1}. {q.q}</div>
                  <div className="q-options">
                    {q.options.map((opt, j) => {
                      const selected = mockAnswers[`reading-${i}`] === j;
                      const isCorrect = mockSubmitted && j === q.answer;
                      const isWrong = mockSubmitted && selected && j !== q.answer;
                      return (
                        <label key={j} className={`q-option ${selected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}>
                          <input
                            type="radio"
                            name={`reading-${i}`}
                            checked={selected}
                            onChange={() => answerQuestion('reading', i, j)}
                            disabled={mockSubmitted}
                          />
                          {String.fromCharCode(65 + j)}. {opt}
                        </label>
                      );
                    })}
                  </div>
                  {mockSubmitted && <div className="q-explain">💡 {q.explain}</div>}
                </div>
              ))}
            </div>

            {/* 听力 */}
            <div className="mock-section">
              <h3>🎧 听力（{MOCK_QUESTIONS.listening.length} 题）</h3>
              <p className="muted" style={{ fontSize: 12 }}>（请想象听力内容并作答）</p>
              {MOCK_QUESTIONS.listening.map((q, i) => (
                <div key={i} className="mock-question">
                  <div className="q-text">{i + 1}. {q.q}</div>
                  <div className="q-options">
                    {q.options.map((opt, j) => {
                      const selected = mockAnswers[`listening-${i}`] === j;
                      const isCorrect = mockSubmitted && j === q.answer;
                      const isWrong = mockSubmitted && selected && j !== q.answer;
                      return (
                        <label key={j} className={`q-option ${selected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}>
                          <input
                            type="radio"
                            name={`listening-${i}`}
                            checked={selected}
                            onChange={() => answerQuestion('listening', i, j)}
                            disabled={mockSubmitted}
                          />
                          {String.fromCharCode(65 + j)}. {opt}
                        </label>
                      );
                    })}
                  </div>
                  {mockSubmitted && <div className="q-explain">💡 {q.explain}</div>}
                </div>
              ))}
            </div>

            {/* 语法 */}
            <div className="mock-section">
              <h3>📝 语法（{MOCK_QUESTIONS.grammar.length} 题）</h3>
              {MOCK_QUESTIONS.grammar.map((q, i) => (
                <div key={i} className="mock-question">
                  <div className="q-text">{i + 1}. {q.q}</div>
                  <div className="q-options">
                    {q.options.map((opt, j) => {
                      const selected = mockAnswers[`grammar-${i}`] === j;
                      const isCorrect = mockSubmitted && j === q.answer;
                      const isWrong = mockSubmitted && selected && j !== q.answer;
                      return (
                        <label key={j} className={`q-option ${selected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}>
                          <input
                            type="radio"
                            name={`grammar-${i}`}
                            checked={selected}
                            onChange={() => answerQuestion('grammar', i, j)}
                            disabled={mockSubmitted}
                          />
                          {String.fromCharCode(65 + j)}. {opt}
                        </label>
                      );
                    })}
                  </div>
                  {mockSubmitted && <div className="q-explain">💡 {q.explain}</div>}
                </div>
              ))}
            </div>

            {/* 写作 */}
            <div className="mock-section">
              <h3>✍️ 写作（{MOCK_QUESTIONS.writing.length} 题）</h3>
              {MOCK_QUESTIONS.writing.map((q, i) => (
                <div key={i} className="mock-question">
                  <div className="q-text">{i + 1}. {q.q}</div>
                  <textarea
                    className="writing-area"
                    placeholder="在此输入你的作文..."
                    rows={5}
                  />
                  {mockSubmitted && (
                    <div className="q-explain">💡 {q.reference}</div>
                  )}
                </div>
              ))}
            </div>

            {!mockSubmitted && (
              <button className="btn warm" onClick={submitMock} style={{ marginTop: 16 }}>
                📤 提交试卷
              </button>
            )}
          </div>
        </>
      )}

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
            <h2>💰 费用参考</h2>
            <div className="fee-list">
              <div className="fee-item"><span>报名费</span><strong>¥1500-1800</strong></div>
              <div className="fee-item"><span>教材费</span><strong>¥200-400</strong></div>
              <div className="fee-item"><span>交通住宿</span><strong>¥0-500</strong></div>
              <div className="fee-item total"><span>合计</span><strong>¥1700-2700</strong></div>
            </div>
            <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
              💡 长沙本地考生可节省交通住宿费用
            </p>
          </div>

          <div className="panel">
            <h2>🏫 长沙考点信息</h2>
            <div className="item-list">
              <div className="item-row">
                <span className="word" style={{ minWidth: '180px' }}>湖南师大歌德中心</span>
                <span className="meaning">岳麓区麓山南路</span>
                <span className="tag">推荐</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '180px' }}>湖南大学德语考点</span>
                <span className="meaning">岳麓区麓山南路</span>
                <span className="tag">备选</span>
              </div>
              <div className="item-row">
                <span className="word" style={{ minWidth: '180px' }}>中南大学外语考点</span>
                <span className="meaning">岳麓区左家垅</span>
                <span className="tag">备选</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

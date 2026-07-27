import { useState, useEffect } from 'react';
import { getBabyAge, dailySeed } from '../utils.js';

const BABY_INFO = {
  name: '蛋堡',
  birthday: '2025-10-21',
  defaultWeight: '10.3',
  defaultHeight: '71',
};

// 大动作训练轮换库（每日轮换一个，含动作要领+训练时长）
const GROSS_MOTOR_LIBRARY = [
  {
    name: '🐸 手膝爬行训练',
    duration: '建议训练 15 分钟',
    points: [
      '让宝宝趴在爬行垫上，用玩具在正前方 30cm 处吸引',
      '用手掌轻托宝宝腹部，帮助其保持手膝支撑姿势',
      '在宝宝后方轻推一侧脚掌，引导交替向前爬行',
      '如果宝宝趴下，可短暂托起腹部 3-5 秒再放下',
    ],
    tip: '重点训练！蛋堡目前还不会手膝爬，每天坚持必有进步',
    video: 'https://www.bilibili.com/video/BV1HJ411L7uD/',
  },
  {
    name: '🪜 扶站练习',
    duration: '建议训练 10 分钟',
    points: [
      '让宝宝扶着沙发或矮桌站立，双脚分开与肩同宽',
      '在宝宝前方放玩具，鼓励其单手扶物去抓',
      '观察宝宝是否能稳定站立 30 秒以上',
      '若宝宝腿软，可暂停休息 1 分钟再继续',
    ],
    tip: '锻炼腿部力量，为独站和行走做准备',
    video: 'https://www.bilibili.com/video/BV1rV411b7TN/',
  },
  {
    name: '🔄 翻滚游戏',
    duration: '建议训练 10 分钟',
    points: [
      '让宝宝仰卧，在侧面用玩具引导其翻身',
      '左右两侧交替练习，每侧 5 分钟',
      '翻身时轻轻协助宝宝转动髋部',
      '完成后给宝宝鼓励和拥抱',
    ],
    tip: '增强躯干灵活性和核心力量',
    video: 'https://www.bilibili.com/video/BV1L4411c7om/',
  },
  {
    name: '🤸 趴卧抬头',
    duration: '建议训练 10 分钟',
    points: [
      '让宝宝趴在垫子上，双手撑在胸前',
      '在前方摇铃或叫名字，引导宝宝抬头',
      '保持抬头姿势 10-20 秒，逐步延长',
      '每天 2-3 次，每次 5-10 分钟',
    ],
    tip: '巩固颈背力量，是爬行的基础',
    video: 'https://www.bilibili.com/video/BV1S7411B7K6/',
  },
  {
    name: '🎯 坐位平衡',
    duration: '建议训练 10 分钟',
    points: [
      '让宝宝独坐，家长在侧保护',
      '在前方左右两侧放玩具，引导转身抓取',
      '观察宝宝是否能稳定坐 1 分钟不倒',
      '若倒下，重新扶起继续练习',
    ],
    tip: '锻炼核心稳定性和平衡感',
    video: 'https://www.bilibili.com/video/BV14J411s7Yg/',
  },
  {
    name: '🪀 拉坐练习',
    duration: '建议训练 5 分钟',
    points: [
      '让宝宝仰卧，家长握住宝宝双手',
      '缓慢拉起宝宝至坐位，再缓慢放下',
      '重复 5-8 次，注意动作要轻柔',
      '观察宝宝颈部是否用力配合',
    ],
    tip: '锻炼腹部力量和颈部控制',
    video: 'https://www.bilibili.com/video/BV17741117ZP/',
  },
  {
    name: '🦵 蹬腿练习',
    duration: '建议训练 8 分钟',
    points: [
      '让宝宝仰卧，家长把手指放在宝宝脚底',
      '鼓励宝宝蹬腿，给予反向轻阻力',
      '左右脚交替进行，每侧 4 分钟',
      '配合儿歌节奏，增加趣味性',
    ],
    tip: '锻炼腿部力量，为站立和行走做准备',
    video: 'https://www.bilibili.com/video/BV1cV411b7gV/',
  },
];

// 语言训练 - SSS 英文儿歌 + 中文童谣轮换库
const LANGUAGE_LIBRARY = [
  {
    type: '🎵 SSS 英文儿歌',
    title: 'Twinkle Twinkle Little Star',
    en: 'Twinkle, twinkle, little star, How I wonder what you are!',
    cn: '一闪一闪小星星，我多想知道你是什么',
    link: 'https://www.bilibili.com/video/BV1uE411s7gE/',
    tip: '唱的时候配合手指闪烁的动作，吸引宝宝注意力',
  },
  {
    type: '🐰 中文童谣',
    title: '小白兔白又白',
    en: '小白兔，白又白，两只耳朵竖起来，爱吃萝卜和青菜，蹦蹦跳跳真可爱',
    cn: '配合动作：竖耳朵、啃萝卜、蹦跳',
    link: 'https://www.bilibili.com/video/BV1nx411P7tK/',
    tip: '边唱边做动作，宝宝会跟着模仿',
  },
  {
    type: '🎵 SSS 英文儿歌',
    title: 'Old MacDonald Had a Farm',
    en: 'Old MacDonald had a farm, E-I-E-I-O!',
    cn: '老麦克唐纳有个农场，咿呀咿呀呦',
    link: 'https://www.bilibili.com/video/BV1cx411b7gS/',
    tip: '模仿各种动物叫声，宝宝会觉得很有趣',
  },
  {
    type: '🌟 中文童谣',
    title: '一闪一闪亮晶晶',
    en: '一闪一闪亮晶晶，满天都是小星星',
    cn: '配合手指张开握合的动作',
    link: 'https://www.bilibili.com/video/BV1uE411s7gE/',
    tip: '睡前唱，有助于建立睡眠仪式',
  },
  {
    type: '🎵 SSS 英文儿歌',
    title: 'The Wheels on the Bus',
    en: 'The wheels on the bus go round and round!',
    cn: '公交车上的轮子转呀转',
    link: 'https://www.bilibili.com/video/BV1Wx411F7wS/',
    tip: '配合手臂转圈动作，宝宝会跟着模仿',
  },
  {
    type: '🐛 中文童谣',
    title: '毛毛虫',
    en: '毛毛虫，爬呀爬，爬到枝头开了花，变成蝴蝶飞走啦',
    cn: '配合手指爬行、变花、飞走的动作',
    link: '',
    tip: '动作丰富，宝宝喜欢模仿',
  },
  {
    type: '🎵 SSS 英文儿歌',
    title: 'Head Shoulders Knees & Toes',
    en: 'Head, shoulders, knees and toes, knees and toes!',
    cn: '头、肩膀、膝盖和脚趾',
    link: 'https://www.bilibili.com/video/BV1cx411b7gS/',
    tip: '边唱边指身体部位，帮助宝宝认识身体',
  },
];

const DAILY_ROUTINE = [
  { time: '06:00', act: '起床 + 亲子互动', note: '早晨亲子时光' },
  { time: '08:00', act: '奶 + 趴卧练习', note: '趴卧 10 分钟' },
  { time: '10:00', act: '小睡 1 小时', note: '保证充足睡眠' },
  { time: '11:30', act: '辅食 + 自由玩耍', note: '软烂粥为主' },
  { time: '14:00', act: '午睡 1.5-2 小时', note: '保证充足睡眠' },
  { time: '16:00', act: '户外活动 + 大动作训练', note: '今日推荐项目' },
  { time: '18:00', act: '洗澡 + 亲子阅读', note: '睡前读绘本' },
  { time: '20:30', act: '入睡 + 童谣', note: '今日推荐童谣' },
];

export default function EggBaoPage() {
  const age = getBabyAge();

  // 身高体重输入
  const [bodyData, setBodyData] = useState(() => {
    try {
      const saved = localStorage.getItem('baby_body');
      return saved ? JSON.parse(saved) : { weight: '', height: '' };
    } catch {
      return { weight: '', height: '' };
    }
  });
  const [inputWeight, setInputWeight] = useState('');
  const [inputHeight, setInputHeight] = useState('');

  useEffect(() => {
    try { localStorage.setItem('baby_body', JSON.stringify(bodyData)); } catch {}
  }, [bodyData]);

  const saveBody = () => {
    setBodyData({
      weight: inputWeight || bodyData.weight,
      height: inputHeight || bodyData.height,
    });
    setInputWeight('');
    setInputHeight('');
  };

  // 每日轮换大动作训练和语言童谣
  const todayMotor = GROSS_MOTOR_LIBRARY[dailySeed(GROSS_MOTOR_LIBRARY.length)];
  const todaySong = LANGUAGE_LIBRARY[dailySeed(LANGUAGE_LIBRARY.length, 3)];

  // 显示数据（如未填写用默认值）
  const displayWeight = bodyData.weight || BABY_INFO.defaultWeight;
  const displayHeight = bodyData.height || BABY_INFO.defaultHeight;

  return (
    <div>
      <div className="page-header">
        <h1>🍼 蛋堡的早教训练</h1>
        <p>陪伴蛋堡健康快乐成长 🌱</p>
        <div className="meta">
          <span className="tag">👶 {BABY_INFO.name}</span>
          <span className="tag warm">📅 {age.label}</span>
          <span className="tag">⚖️ {displayWeight} kg / {displayHeight} cm</span>
        </div>
      </div>

      <div className="cards">
        <div className="card green">
          <div className="icon">📅</div>
          <div className="label">月龄</div>
          <div className="value">{age.months}<span className="unit">月</span></div>
        </div>
        <div className="card warm">
          <div className="icon">⚖️</div>
          <div className="label">体重</div>
          <div className="value">{displayWeight}<span className="unit">kg</span></div>
        </div>
        <div className="card">
          <div className="icon">📏</div>
          <div className="label">身高</div>
          <div className="value">{displayHeight}<span className="unit">cm</span></div>
        </div>
        <div className="card green">
          <div className="icon">🎯</div>
          <div className="label">今日训练</div>
          <div className="value">{todayMotor.name.split(' ')[0]}<span className="unit">轮换</span></div>
        </div>
      </div>

      {/* 身高体重录入 */}
      <div className="panel warm">
        <h2>📝 身高体重记录</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 10 }}>
          录入新数据后，上方卡片会自动更新；如不填写则显示上次数据
        </p>
        <div className="body-input-row">
          <input
            type="text"
            placeholder={`体重 kg（当前 ${displayWeight}）`}
            value={inputWeight}
            onChange={(e) => setInputWeight(e.target.value)}
          />
          <input
            type="text"
            placeholder={`身高 cm（当前 ${displayHeight}）`}
            value={inputHeight}
            onChange={(e) => setInputHeight(e.target.value)}
          />
          <button className="btn warm" onClick={saveBody}>保存</button>
        </div>
      </div>

      {/* 今日大动作训练 */}
      <div className="panel">
        <h2>🧗 今日大动作训练</h2>
        <div className="training-card">
          <div className="train-head">
            <span className="train-name">{todayMotor.name}</span>
            <span className="train-duration">⏱️ {todayMotor.duration}</span>
          </div>
          <div className="train-section-title">动作要领</div>
          <ol className="train-points">
            {todayMotor.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
          <div className="train-tip">💡 {todayMotor.tip}</div>
          {todayMotor.video && (
            <a className="song-link train-video-link" href={todayMotor.video} target="_blank" rel="noopener noreferrer">
              ▶️ 观看训练演示视频
            </a>
          )}
        </div>
      </div>

      {/* 今日语言训练 - 童谣 */}
      <div className="panel warm">
        <h2>🎵 今日语言训练 · 童谣</h2>
        <div className="song-card">
          <div className="song-type">{todaySong.type}</div>
          <div className="song-title">{todaySong.title}</div>
          <div className="song-lyrics">
            <div className="lyric-en">{todaySong.en}</div>
            {todaySong.cn && <div className="lyric-cn">📖 {todaySong.cn}</div>}
          </div>
          {todaySong.link && (
            <a className="song-link" href={todaySong.link} target="_blank" rel="noopener noreferrer">
              ▶️ 点击观看视频
            </a>
          )}
          <div className="song-tip">💡 {todaySong.tip}</div>
        </div>
      </div>

      {/* 今日作息 */}
      <div className="panel">
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
  );
}

import { useState } from 'react';

const BABY_INFO = {
  name: '蛋堡',
  age: '8 个月',
  stage: '软烂粥阶段',
  feeding: '纯母乳喂养',
  note: '吞咽能力未完全，排敏基本完成',
};

const TODAY_SUPPLEMENTS = [
  { time: '06:00', name: '维生素 D3', note: '今天轮到吃 D3', type: 'd3', highlight: true },
  { time: '10:00', name: '维生素', note: '上午补充', type: 'vitamin' },
  { time: '18:00', name: '碳酸钙', note: '晚上补充', type: 'calcium' },
];

const DIET_PLAN = [
  { meal: '🍼 上午奶', time: '07:00', content: '母乳喂养', note: '按需喂养' },
  { meal: '🥣 上午辅食', time: '10:30', content: '软烂粥 + 蔬菜泥 + 少量肉泥', note: '粥煮至非常软烂，蔬菜切极碎' },
  { meal: '🍼 下午奶', time: '14:00', content: '母乳喂养', note: '午睡醒来后' },
  { meal: '🥣 下午辅食', time: '16:30', content: '软烂粥 + 蛋黄泥 + 水果泥', note: '蛋黄从1/4个开始尝试' },
  { meal: '🍼 睡前奶', time: '20:00', content: '母乳喂养', note: '睡前充足喂养' },
];

// 详细菜谱
const RECIPES = [
  {
    id: 1,
    emoji: '🥕',
    name: '胡萝卜软烂粥',
    age: '8 月龄',
    time: '30 分钟',
    ingredients: ['大米 30g', '胡萝卜 30g', '清水 300ml'],
    steps: [
      '大米淘洗干净，提前浸泡 30 分钟，沥干备用',
      '胡萝卜去皮切薄片，蒸 15 分钟至软烂',
      '蒸熟的胡萝卜加少量温水，用料理棒打成细腻的胡萝卜泥',
      '锅中加 300ml 清水煮沸，放入大米',
      '大火煮沸后转小火慢煮 20 分钟，期间偶尔搅拌防止糊底',
      '煮至米粒完全开花、粥体浓稠细腻',
      '加入胡萝卜泥，搅拌均匀，再煮 2 分钟',
      '关火晾至温热（约 37℃），即可喂食',
    ],
    nutrition: [
      { label: '热量', value: '~80 kcal' },
      { label: '主食', value: '大米 30g' },
      { label: '蔬菜', value: '胡萝卜 30g' },
    ],
    tip: '8 月龄宝宝吞咽能力未完全，粥一定要煮到米粒开花，可以用勺背压一下米粒检查是否够软烂。',
  },
  {
    id: 2,
    emoji: '🐟',
    name: '三文鱼蔬菜软烂粥',
    age: '8 月龄',
    time: '35 分钟',
    ingredients: ['大米 30g', '三文鱼 20g', '菠菜 20g', '清水 300ml', '柠檬 1 片'],
    steps: [
      '大米淘洗干净，提前浸泡 30 分钟',
      '三文鱼切小块，挤几滴柠檬汁去腥，腌 5 分钟',
      '菠菜洗净，焯水 30 秒去除草酸，捞出沥干',
      '焯好的菠菜切碎再剁成极碎的菜泥',
      '三文鱼上锅蒸 8 分钟至熟透，去刺检查',
      '蒸好的三文鱼用勺子压成鱼泥，再次检查有无小刺',
      '锅中加水煮沸，放入大米，大火煮沸后转小火煮 20 分钟',
      '粥煮烂后加入三文鱼泥和菠菜泥，搅拌均匀',
      '小火再煮 3 分钟，关火晾温即可喂食',
    ],
    nutrition: [
      { label: '热量', value: '~120 kcal' },
      { label: '蛋白质', value: '三文鱼 20g' },
      { label: '蔬菜', value: '菠菜 20g' },
    ],
    tip: '三文鱼富含 DHA，对宝宝大脑发育有益。一定要仔细检查鱼刺，确保完全去净。',
  },
  {
    id: 3,
    emoji: '🥚',
    name: '蛋黄南瓜软烂粥',
    age: '8 月龄',
    time: '40 分钟',
    ingredients: ['大米 30g', '南瓜 40g', '蛋黄 1/4 个', '清水 300ml'],
    steps: [
      '大米淘洗干净，提前浸泡 30 分钟',
      '南瓜去皮去籽，切小块',
      '鸡蛋冷水下锅，水开后煮 10 分钟，煮熟后取出过冷水',
      '剥去蛋壳，取出蛋黄（蛋白 1 岁以下宝宝不吃），用勺子压成蛋黄泥',
      '南瓜块上锅蒸 15 分钟至软烂',
      '蒸好的南瓜加少量温水，打成细腻的南瓜泥',
      '锅中加水煮沸，放入大米，大火煮沸后转小火煮 20 分钟',
      '粥煮烂后加入南瓜泥和 1/4 个蛋黄泥，搅拌均匀',
      '再煮 2 分钟，关火晾温即可',
    ],
    nutrition: [
      { label: '热量', value: '~110 kcal' },
      { label: '蛋白质', value: '蛋黄 1/4 个' },
      { label: '主食', value: '大米 30g' },
    ],
    tip: '蛋黄是常见过敏原，第一次添加从 1/8 个开始，观察 3 天无过敏反应再增加到 1/4 个。',
  },
  {
    id: 4,
    emoji: '🥔',
    name: '土豆鸡胸肉软烂粥',
    age: '8 月龄',
    time: '40 分钟',
    ingredients: ['大米 30g', '鸡胸肉 20g', '土豆 30g', '清水 300ml', '姜 1 片'],
    steps: [
      '大米淘洗干净，提前浸泡 30 分钟',
      '鸡胸肉切小块，冷水下锅加姜片焯水，去除血沫',
      '焯水后的鸡胸肉捞出，冲洗干净，重新上锅蒸 15 分钟至熟透',
      '蒸熟的鸡胸肉剁成极碎的肉泥（或用料理棒打成泥）',
      '土豆去皮切小块，上锅蒸 15 分钟至软烂',
      '蒸好的土豆加少量温水，压成细腻的土豆泥',
      '锅中加水煮沸，放入大米，大火煮沸后转小火煮 20 分钟',
      '粥煮烂后加入鸡胸肉泥和土豆泥，搅拌均匀',
      '小火再煮 3 分钟，关火晾温即可',
    ],
    nutrition: [
      { label: '热量', value: '~130 kcal' },
      { label: '蛋白质', value: '鸡肉 20g' },
      { label: '主食', value: '大米+土豆' },
    ],
    tip: '鸡肉是优质蛋白来源，适合作为宝宝的主要肉类辅食。剁肉泥时要顺着纹理剁，更易消化。',
  },
  {
    id: 5,
    emoji: '🍌',
    name: '香蕉苹果泥',
    age: '8 月龄',
    time: '5 分钟',
    ingredients: ['香蕉 1/2 根', '苹果 1/4 个'],
    steps: [
      '香蕉选择熟透的（表皮有黑点最佳），剥皮取 1/2',
      '苹果洗净去皮去核，取 1/4 个',
      '用不锈钢勺子刮苹果肉，刮成细腻的苹果泥',
      '香蕉放在小碗里，用勺子压成泥',
      '将苹果泥和香蕉泥混合搅拌均匀',
      '可以直接喂食，或加入少量温水调整稠度',
    ],
    nutrition: [
      { label: '热量', value: '~60 kcal' },
      { label: '水果', value: '香蕉+苹果' },
      { label: '维生素', value: 'VC、钾' },
    ],
    tip: '水果泥现做现吃，避免氧化变质。香蕉有通便作用，宝宝腹泻时暂停食用。',
  },
  {
    id: 6,
    emoji: '🥣',
    name: '红枣山药软烂粥',
    age: '8 月龄',
    time: '45 分钟',
    ingredients: ['大米 30g', '山药 40g', '红枣 2 颗', '清水 300ml'],
    steps: [
      '大米淘洗干净，提前浸泡 30 分钟',
      '山药去皮（戴手套防止过敏），切小块，立即泡入清水防止氧化',
      '红枣洗净，温水浸泡 15 分钟，去核去皮',
      '红枣肉上锅蒸 10 分钟，趁热压成枣泥',
      '山药块上锅蒸 15 分钟至软烂',
      '蒸好的山药加少量温水，打成细腻的山药泥',
      '锅中加水煮沸，放入大米，大火煮沸后转小火煮 20 分钟',
      '粥煮烂后加入山药泥和枣泥（去核），搅拌均匀',
      '再煮 3 分钟，关火晾温即可',
    ],
    nutrition: [
      { label: '热量', value: '~120 kcal' },
      { label: '主食', value: '大米+山药' },
      { label: '功效', value: '健脾胃' },
    ],
    tip: '山药有健脾胃作用，但去皮时戴手套防止过敏。红枣要去核去皮，避免噎到宝宝。',
  },
];

const ALLERGY_FOODS = [
  { name: '🥚 鸡蛋黄', status: '已排敏', note: '从1/4个开始' },
  { name: '🥕 胡萝卜', status: '已排敏', note: '泥状' },
  { name: '🥬 菠菜', status: '已排敏', note: '焯水后切碎' },
  { name: '🥔 土豆', status: '已排敏', note: '蒸熟压泥' },
  { name: '🐟 三文鱼', status: '已排敏', note: '去刺极碎' },
  { name: '🐔 鸡肉', status: '已排敏', note: '肉泥' },
  { name: '🍎 苹果', status: '已排敏', note: '刮泥' },
  { name: '🍌 香蕉', status: '已排敏', note: '压泥' },
  { name: '🎃 南瓜', status: '已排敏', note: '蒸熟压泥' },
  { name: '🍠 山药', status: '已排敏', note: '蒸熟压泥' },
  { name: '🥑 牛油果', status: '待尝试', note: '建议近期添加' },
  { name: '🐷 猪肉', status: '待尝试', note: '建议近期添加' },
];

const EATING_SKILLS = [
  { skill: '张嘴接食', status: '练习中', icon: '👄' },
  { skill: '咀嚼动作', status: '练习中', icon: '🦷' },
  { skill: '吞咽协调', status: '练习中', icon: '😋' },
  { skill: '用勺子进食', status: '刚开始', icon: '🥄' },
];

const INIT_TASKS = [
  { id: 1, title: '准备上午辅食（胡萝卜软烂粥）', done: true },
  { id: 2, title: '下午加餐做香蕉苹果泥', done: false },
  { id: 3, title: '补充 D3', done: false },
  { id: 4, title: '补充碳酸钙', done: false },
];

export default function FoodPage() {
  const [activeTab, setActiveTab] = useState('today');
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [input, setInput] = useState('');

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const add = () => {
    const title = input.trim();
    if (!title) return;
    setTasks((prev) => [...prev, { id: Date.now(), title, done: false }]);
    setInput('');
  };
  const toggle = (id) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div>
      <div className="page-header">
        <h1>🥣 蛋堡辅食计划</h1>
        <p>{BABY_INFO.name} 的专属辅食安排 🍽️</p>
        <div className="meta">
          <span className="tag">👶 {BABY_INFO.age}</span>
          <span className="tag warm">🥣 {BABY_INFO.stage}</span>
          <span className="tag">🍼 {BABY_INFO.feeding}</span>
        </div>
      </div>

      <div className="cards">
        <div className="card green">
          <div className="icon">✅</div>
          <div className="label">已排敏食物</div>
          <div className="value">
            {ALLERGY_FOODS.filter((f) => f.status === '已排敏').length} / {ALLERGY_FOODS.length}
          </div>
        </div>
        <div className="card warm">
          <div className="icon">📖</div>
          <div className="label">菜谱数量</div>
          <div className="value">{RECIPES.length}<span className="unit">道</span></div>
        </div>
        <div className="card">
          <div className="icon">💊</div>
          <div className="label">补充剂</div>
          <div className="value">{TODAY_SUPPLEMENTS.length}<span className="unit">种</span></div>
        </div>
        <div className="card green">
          <div className="icon">✅</div>
          <div className="label">今日任务</div>
          <div className="value">{doneCount} / {tasks.length}</div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>📅 今日安排</button>
        <button className={`tab ${activeTab === 'recipe' ? 'active' : ''}`} onClick={() => setActiveTab('recipe')}>📖 详细菜谱</button>
        <button className={`tab ${activeTab === 'allergy' ? 'active' : ''}`} onClick={() => setActiveTab('allergy')}>✅ 排敏清单</button>
      </div>

      {/* 今日安排 */}
      {activeTab === 'today' && (
        <>
          <div className="panel warm">
            <h2>💊 今日补充剂</h2>
            <div className="timeline">
              {TODAY_SUPPLEMENTS.map((s) => (
                <div key={s.time} className={`timeline-item ${s.highlight ? 'warm' : ''}`}>
                  <div className="time">{s.time}</div>
                  <div className="desc">
                    <strong>{s.name}</strong>
                    {s.note && <span style={{ color: 'var(--muted)', marginLeft: 8 }}>· {s.note}</span>}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 12, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
              💡 AD 和 D3 交替服用，今天吃 D3，明天吃 AD。
            </p>
          </div>

          <div className="panel">
            <h2>⏰ 今日辅食安排</h2>
            <div className="diet-plan">
              {DIET_PLAN.map((d) => (
                <div key={d.meal} className="diet-meal">
                  <div className="meal-name">
                    <span>{d.meal}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 12 }}>{d.time}</span>
                  </div>
                  <div className="food-list">
                    <span className="food-item">{d.content}</span>
                  </div>
                  <div className="note">💡 {d.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel warm">
            <h2>📝 今日辅食任务</h2>
            <div className="row">
              <input
                type="text"
                placeholder="添加一个辅食相关任务（回车提交）"
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
        </>
      )}

      {/* 详细菜谱 */}
      {activeTab === 'recipe' && (
        <>
          {RECIPES.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-head">
                <span className="emoji">{recipe.emoji}</span>
                <span className="name">{recipe.name}</span>
                <span className="age">👶 {recipe.age}</span>
              </div>
              <div className="recipe-body">
                <div className="section-title">⏱️ 制作时长</div>
                <p style={{ margin: 0, marginBottom: 12, color: 'var(--text-soft)', fontSize: 14 }}>
                  约 {recipe.time}
                </p>

                <div className="section-title">🥘 食材准备</div>
                <div className="ingredients">
                  {recipe.ingredients.map((ing, i) => (
                    <span key={i} className="ingredient">{ing}</span>
                  ))}
                </div>

                <div className="section-title">👩‍🍳 制作步骤</div>
                <ol className="steps-list">
                  {recipe.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>

                <div className="section-title">📊 营养信息</div>
                <div className="nutrition">
                  {recipe.nutrition.map((n, i) => (
                    <div key={i} className="item">
                      <strong>{n.value}</strong>{n.label}
                    </div>
                  ))}
                </div>

                <div className="tip">💡 {recipe.tip}</div>
              </div>
            </div>
          ))}

          <div className="panel warm">
            <h2>💡 辅食制作通用要点</h2>
            <div className="lesson">
              <div className="section-title">🍲 软烂粥通用做法</div>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>米水比例约 1:8-1:10，煮出来更软烂</li>
                <li>大米提前浸泡 30 分钟，煮出来更绵密</li>
                <li>大火煮沸后转小火慢煮，期间偶尔搅拌</li>
                <li>用勺背压米粒，能轻松压碎即为煮好</li>
                <li>煮好后焖 5 分钟，口感更好</li>
              </ul>
            </div>
            <div className="lesson">
              <div className="section-title">🥬 蔬菜处理要点</div>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>绿叶蔬菜先焯水 30 秒去除草酸</li>
                <li>根茎蔬菜（土豆、南瓜）蒸 15 分钟</li>
                <li>蒸好后加少量温水打成细腻泥状</li>
                <li>蔬菜切得越碎越好，避免宝宝噎到</li>
              </ul>
            </div>
            <div className="lesson">
              <div className="section-title">🥩 肉类添加要点</div>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>从鸡肉、三文鱼等低敏肉类开始</li>
                <li>肉类先焯水去血沫，再蒸煮至熟透</li>
                <li>剁成极碎肉泥，或用料理棒打成泥</li>
                <li>彻底去骨去刺，再次检查</li>
                <li>每次添加新肉类，连续观察 3 天</li>
              </ul>
            </div>
          </div>
        </>
      )}

      {/* 排敏清单 */}
      {activeTab === 'allergy' && (
        <>
          <div className="panel">
            <h2>✅ 排敏食物清单</h2>
            <div className="item-list">
              {ALLERGY_FOODS.map((f) => (
                <div key={f.name} className="item-row">
                  <span className="word" style={{ minWidth: '100px' }}>{f.name}</span>
                  <span className="meaning">{f.note}</span>
                  <span className={`tag ${f.status === '已排敏' ? '' : 'warm'}`}>
                    {f.status === '已排敏' ? '✅ 已排敏' : '⏳ 待尝试'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel warm">
            <h2>👄 进食技能发展</h2>
            <div className="item-list">
              {EATING_SKILLS.map((s) => (
                <div key={s.skill} className="item-row">
                  <span className="word" style={{ minWidth: '140px' }}>{s.icon} {s.skill}</span>
                  <span className={`tag ${s.status === '练习中' ? 'warm' : 'danger'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 12, color: 'var(--accent-warm-strong)', fontSize: 13 }}>
              💡 蛋堡目前吞咽能力还未完全，辅食要保持软烂，每次喂食量不宜过多，观察宝宝反应。
            </p>
          </div>

          <div className="panel">
            <h2>📋 排敏原则</h2>
            <div className="lesson">
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>每次只添加一种新食物</li>
                <li>连续观察 3 天，无过敏反应再添加新的</li>
                <li>从少量开始，逐渐增加到正常量</li>
                <li>过敏症状：皮疹、腹泻、呕吐、咳嗽</li>
                <li>出现过敏立即停用，严重时就医</li>
                <li>鸡蛋：8 月龄只吃蛋黄，1 岁后吃蛋白</li>
                <li>鱼类：先试三文鱼，无过敏再试其他鱼</li>
                <li>坚果类：3 岁以下不直接吃整颗坚果</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { getBabyAge, dailySeed } from '../utils.js';

// ============ 上午菜谱库（主食类：粥/面/糊，提供能量和蛋白质）============
// 已大幅扩充，覆盖全网主流 9 月+ 婴儿辅食（含中式/西式/日式）
const MORNING_RECIPES = [
  // --- 蔬菜粥类 ---
  { id: 'm01', emoji: '🥕', name: '胡萝卜青菜粥', age: '9 月+', time: '30 分钟',
    nutrition: [{ value: '60', label: 'kcal' }, { value: '2g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['大米 30g', '胡萝卜 30g', '青菜 20g', '植物油 2g'],
    steps: ['大米淘洗加 8 倍水浸泡 30 分钟', '大火煮沸转小火煮 20 分钟', '胡萝卜去皮切小丁，青菜切碎', '粥快好时加胡萝卜丁煮 5 分钟', '关火前加青菜碎焖 2 分钟', '滴入植物油搅匀'],
    tip: '胡萝卜富含 β-胡萝卜素，用油烹调更易吸收' },
  { id: 'm02', emoji: '🥦', name: '西兰花鸡肉粥', age: '9 月+', time: '40 分钟',
    nutrition: [{ value: '90', label: 'kcal' }, { value: '6g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['大米 30g', '鸡胸肉 25g', '西兰花 20g', '姜片 2 片'],
    steps: ['鸡胸肉切丁用姜片焯水去腥', '西兰花焯水后切碎', '大米淘洗加 8 倍水煮粥', '粥煮 15 分钟加鸡肉丁', '继续煮 10 分钟至熟透', '最后加西兰花碎煮 2 分钟'],
    tip: '鸡肉优质蛋白，西兰花富含维生素 C' },
  { id: 'm03', emoji: '🥬', name: '小白菜豆腐粥', age: '9 月+', time: '30 分钟',
    nutrition: [{ value: '80', label: 'kcal' }, { value: '4g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['大米 30g', '嫩豆腐 30g', '小白菜 20g'],
    steps: ['嫩豆腐切小丁', '小白菜焯水后切碎', '大米淘洗加 8 倍水煮粥', '粥煮 20 分钟加豆腐丁', '继续煮 5 分钟', '最后加小白菜碎煮 2 分钟'],
    tip: '豆腐补钙补蛋白，易消化' },
  { id: 'm04', emoji: '🥬', name: '菠菜猪肝粥', age: '9 月+', time: '40 分钟',
    nutrition: [{ value: '95', label: 'kcal' }, { value: '7g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['大米 30g', '猪肝 20g', '菠菜 15g', '姜片 2 片'],
    steps: ['猪肝切薄片用姜片浸泡 15 分钟去腥', '焯水后剁成泥', '菠菜焯水切碎', '大米淘洗加 8 倍水煮粥', '粥煮 20 分钟加猪肝泥', '继续煮 8 分钟，最后加菠菜碎'],
    tip: '猪肝补铁补锌，每周 1-2 次即可' },
  { id: 'm05', emoji: '🥔', name: '土豆牛肉粥', age: '9 月+', time: '45 分钟',
    nutrition: [{ value: '100', label: 'kcal' }, { value: '6g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['大米 30g', '牛肉 25g', '土豆 30g', '洋葱 5g'],
    steps: ['牛肉切丁用料理机打成泥', '土豆去皮切小丁，洋葱切碎', '大米淘洗加 8 倍水煮粥', '粥煮 15 分钟加土豆和洋葱', '加入牛肉泥搅匀', '继续煮 15 分钟至软烂'],
    tip: '牛肉富含铁锌，洋葱提香但量要少' },
  // --- 鱼类粥 ---
  { id: 'm06', emoji: '🐟', name: '三文鱼土豆粥', age: '9 月+', time: '35 分钟',
    nutrition: [{ value: '95', label: 'kcal' }, { value: '5g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['大米 30g', '三文鱼 25g', '土豆 30g', '柠檬 1 片'],
    steps: ['三文鱼用柠檬片腌制 10 分钟去腥', '土豆去皮切丁蒸熟压泥', '大米淘洗加 8 倍水煮粥', '粥快好加三文鱼丁煮 5 分钟', '加土豆泥搅匀', '煮 2 分钟至浓稠'],
    tip: '三文鱼富含 DHA，鱼刺要仔细挑净' },
  { id: 'm07', emoji: '🐟', name: '胡萝卜鳕鱼粥', age: '9 月+', time: '35 分钟',
    nutrition: [{ value: '90', label: 'kcal' }, { value: '5g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['大米 30g', '鳕鱼 25g', '胡萝卜 20g', '柠檬 1 片'],
    steps: ['鳕鱼用柠檬片腌制 10 分钟', '蒸熟后仔细挑刺压碎', '胡萝卜去皮切小丁', '大米淘洗加 8 倍水煮粥', '粥煮 15 分钟加胡萝卜丁', '煮 8 分钟后加鳕鱼碎再煮 5 分钟'],
    tip: '鳕鱼富含 DHA 且刺少，适合宝宝' },
  { id: 'm08', emoji: '🐟', name: '番茄龙利鱼粥', age: '9 月+', time: '35 分钟',
    nutrition: [{ value: '85', label: 'kcal' }, { value: '5g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['大米 30g', '龙利鱼 25g', '番茄 20g', '柠檬 1 片'],
    steps: ['龙利鱼用柠檬腌制去腥切丁', '番茄去皮去籽切碎', '大米淘洗加 8 倍水煮粥', '粥煮 15 分钟加番茄碎', '煮 8 分钟加龙利鱼丁', '再煮 5 分钟即可'],
    tip: '龙利鱼无小刺，番茄酸甜开胃' },
  // --- 蛋黄/南瓜类 ---
  { id: 'm09', emoji: '🥚', name: '蛋黄南瓜粥', age: '9 月+', time: '30 分钟',
    nutrition: [{ value: '85', label: 'kcal' }, { value: '4g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['大米 30g', '熟蛋黄 1/2 个', '南瓜 30g'],
    steps: ['南瓜去皮去瓤切小块蒸熟压泥', '鸡蛋煮熟取蛋黄压碎', '大米淘洗加 8 倍水煮粥', '粥煮 20 分钟加南瓜泥', '搅匀后再煮 5 分钟', '关火撒蛋黄碎焖 1 分钟'],
    tip: '南瓜自然甜味，蛋黄富含铁质' },
  { id: 'm10', emoji: '🍠', name: '红薯山药粥', age: '9 月+', time: '35 分钟',
    nutrition: [{ value: '75', label: 'kcal' }, { value: '2g', label: '蛋白' }, { value: '4g', label: '纤维' }],
    ingredients: ['大米 30g', '红薯 30g', '山药 30g'],
    steps: ['红薯和山药去皮切小丁', '大米淘洗加 8 倍水', '加入红薯丁和山药丁一起煮', '大火煮沸转小火煮 25 分钟', '煮至所有食材软烂', '搅匀可压成更细泥状'],
    tip: '山药健脾胃，红薯通便' },
  // --- 面食类 ---
  { id: 'm11', emoji: '🍅', name: '番茄鸡蛋面', age: '9 月+', time: '20 分钟',
    nutrition: [{ value: '95', label: 'kcal' }, { value: '5g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['宝宝面条 20g', '番茄 30g', '蛋黄 1 个', '植物油 2g'],
    steps: ['番茄去皮去籽切碎', '面条掰成小段', '锅中加水煮沸下面条煮 5 分钟', '加番茄碎继续煮 5 分钟', '打散蛋黄慢慢倒入形成蛋花', '滴入植物油搅匀'],
    tip: '从粥过渡到面条，锻炼咀嚼能力' },
  { id: 'm12', emoji: '🥕', name: '胡萝卜肉末面', age: '9 月+', time: '25 分钟',
    nutrition: [{ value: '100', label: 'kcal' }, { value: '6g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['宝宝面条 20g', '猪肉 20g', '胡萝卜 20g', '青菜 10g'],
    steps: ['猪肉剁成肉末', '胡萝卜去皮切小丁', '面条掰成小段', '锅中加水煮沸下面条', '加胡萝卜丁和肉末煮 8 分钟', '最后加青菜碎煮 2 分钟'],
    tip: '猪肉补铁，搭配蔬菜营养均衡' },
  { id: 'm13', emoji: '🐟', name: '鳕鱼蔬菜面', age: '9 月+', time: '25 分钟',
    nutrition: [{ value: '95', label: 'kcal' }, { value: '5g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['宝宝面条 20g', '鳕鱼 20g', '西兰花 15g', '柠檬 1 片'],
    steps: ['鳕鱼用柠檬腌制蒸熟挑刺', '西兰花焯水切碎', '面条掰成小段', '锅中加水煮沸下面条', '煮 5 分钟加鳕鱼碎', '最后加西兰花煮 2 分钟'],
    tip: '面条+鳕鱼+蔬菜，营养三合一' },
  // --- 米糊/蒸糕类 ---
  { id: 'm14', emoji: '🌽', name: '玉米鸡肉糊', age: '9 月+', time: '30 分钟',
    nutrition: [{ value: '90', label: 'kcal' }, { value: '5g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['甜玉米 40g', '鸡胸肉 20g', '大米 20g', '配方奶 15ml'],
    steps: ['玉米粒蒸熟打成浆过滤', '鸡胸肉剁成泥', '大米淘洗加 6 倍水煮粥', '粥煮 15 分钟加玉米浆', '加鸡肉泥搅匀煮 8 分钟', '关火加温配方奶调稀'],
    tip: '玉米甜香，宝宝爱吃' },
  { id: 'm15', emoji: '🥚', name: '蒸蛋黄羹', age: '9 月+', time: '15 分钟',
    nutrition: [{ value: '70', label: 'kcal' }, { value: '4g', label: '蛋白' }, { value: '0g', label: '纤维' }],
    ingredients: ['蛋黄 1 个', '温水 50ml', '香油 1 滴'],
    steps: ['蛋黄打散加温水搅匀', '过筛去泡沫', '盖上保鲜膜扎几个小孔', '上锅蒸 10 分钟', '关火焖 2 分钟', '滴入香油即可'],
    tip: '嫩滑易吞咽，宝宝接受度高' },
  { id: 'm16', emoji: '🥔', name: '土豆泥肉松碗', age: '9 月+', time: '25 分钟',
    nutrition: [{ value: '95', label: 'kcal' }, { value: '4g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['土豆 50g', '自制肉松 5g', '配方奶 20ml', '黄油 2g'],
    steps: ['土豆去皮切小块蒸熟', '趁热压成泥', '加入黄油搅匀', '加温配方奶调稠度', '撒上自制肉松', '拌匀食用'],
    tip: '肉松提味，可一次性多做冷藏' },
];

// ============ 下午菜谱库（加餐类：果泥/蛋黄/酸奶/蒸糕，清爽易消化）============
const AFTERNOON_RECIPES = [
  // --- 水果泥类 ---
  { id: 'a01', emoji: '🍌', name: '香蕉苹果泥', age: '9 月+', time: '5 分钟',
    nutrition: [{ value: '70', label: 'kcal' }, { value: '1g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['香蕉 1/2 根', '苹果 1/4 个'],
    steps: ['香蕉去皮切小段', '苹果去皮去核切小块', '一起放入料理机打成泥', '可直接食用或加少量温水调稀'],
    tip: '无需加热保留维生素' },
  { id: 'a02', emoji: '🥑', name: '牛油果香蕉泥', age: '9 月+', time: '5 分钟',
    nutrition: [{ value: '120', label: 'kcal' }, { value: '2g', label: '蛋白' }, { value: '5g', label: '纤维' }],
    ingredients: ['牛油果 1/4 个', '香蕉 1/4 根'],
    steps: ['牛油果对半切开去核挖果肉', '香蕉去皮切小段', '一起压成泥或料理机打匀', '可加少量母乳调稀'],
    tip: '牛油果富含好脂肪，助大脑发育' },
  { id: 'a03', emoji: '🫐', name: '蓝莓酸奶泥', age: '9 月+', time: '5 分钟',
    nutrition: [{ value: '65', label: 'kcal' }, { value: '2g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['蓝莓 10 颗', '无糖酸奶 30g'],
    steps: ['蓝莓洗净用淡盐水浸泡 5 分钟', '捞出沥干压成泥', '加入酸奶搅匀', '可加少量香蕉泥增甜'],
    tip: '蓝莓富含花青素，护眼明目' },
  { id: 'a04', emoji: '🍐', name: '雪梨莲藕糊', age: '9 月+', time: '25 分钟',
    nutrition: [{ value: '55', label: 'kcal' }, { value: '1g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['雪梨 30g', '莲藕 20g'],
    steps: ['雪梨去皮去核切小块', '莲藕去皮磨成泥', '一起加少量水煮 15 分钟', '煮至软烂压成糊'],
    tip: '雪梨润肺，莲藕健脾，适合秋季' },
  { id: 'a05', emoji: '🍑', name: '水蜜桃米糊', age: '9 月+', time: '10 分钟',
    nutrition: [{ value: '50', label: 'kcal' }, { value: '1g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['熟水蜜桃 30g', '婴儿米粉 15g', '温水 30ml'],
    steps: ['水蜜桃去皮去核切小块', '压成泥或料理机打成泥', '婴儿米粉用温水调匀', '加入水蜜桃泥搅匀'],
    tip: '水蜜桃香甜，需确认不过敏' },
  { id: 'a06', emoji: '🥝', name: '猕猴桃酸奶泥', age: '9 月+', time: '5 分钟',
    nutrition: [{ value: '60', label: 'kcal' }, { value: '2g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['熟猕猴桃 1/4 个', '无糖酸奶 30g'],
    steps: ['猕猴桃去皮切小块', '压成泥', '加入酸奶搅匀', '可加少量香蕉泥调甜'],
    tip: '猕猴桃维 C 高，但易过敏需先试敏' },
  // --- 蛋黄/薯类 ---
  { id: 'a07', emoji: '🥚', name: '蛋黄土豆泥', age: '9 月+', time: '20 分钟',
    nutrition: [{ value: '90', label: 'kcal' }, { value: '4g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['熟蛋黄 1/2 个', '土豆 30g', '配方奶 15ml'],
    steps: ['土豆去皮切小块蒸熟', '趁热压成泥', '加入熟蛋黄搅匀', '加温配方奶调至适合浓稠度'],
    tip: '口感绵密，宝宝接受度高' },
  { id: 'a08', emoji: '🍠', name: '紫薯小米糊', age: '9 月+', time: '30 分钟',
    nutrition: [{ value: '75', label: 'kcal' }, { value: '2g', label: '蛋白' }, { value: '3g', label: '纤维' }],
    ingredients: ['小米 25g', '紫薯 30g'],
    steps: ['小米淘洗干净', '紫薯去皮切小丁', '小米加 10 倍水煮开', '加紫薯丁', '小火煮 20 分钟至软烂', '用料理机打成糊状'],
    tip: '紫薯富含花青素，颜色漂亮' },
  { id: 'a09', emoji: '🌽', name: '玉米南瓜糊', age: '9 月+', time: '25 分钟',
    nutrition: [{ value: '80', label: 'kcal' }, { value: '2g', label: '蛋白' }, { value: '4g', label: '纤维' }],
    ingredients: ['甜玉米 50g', '南瓜 30g', '配方奶 30ml'],
    steps: ['玉米粒蒸熟打成浆过滤去玉米皮', '南瓜蒸熟压成泥', '将玉米浆和南瓜泥混合', '加温热配方奶搅匀'],
    tip: '玉米甜香，注意过滤皮渣' },
  // --- 蒸糕/松饼类（锻炼咀嚼） ---
  { id: 'a10', emoji: '🥞', name: '南瓜松饼', age: '9 月+', time: '25 分钟',
    nutrition: [{ value: '90', label: 'kcal' }, { value: '3g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['南瓜 40g', '蛋黄 1 个', '低筋面粉 20g', '配方奶 15ml'],
    steps: ['南瓜蒸熟压泥', '加蛋黄搅匀', '加配方奶和过筛面粉搅匀成糊', '不粘锅小火舀一勺面糊', '煎至两面金黄', '切小块食用'],
    tip: '锻炼手抓能力，宝宝爱吃' },
  { id: 'a11', emoji: '🥕', name: '胡萝卜蒸糕', age: '9 月+', time: '30 分钟',
    nutrition: [{ value: '75', label: 'kcal' }, { value: '3g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['胡萝卜 30g', '蛋黄 1 个', '低筋面粉 15g', '植物油 2g'],
    steps: ['胡萝卜蒸熟压泥', '加蛋黄搅匀', '加过筛面粉成糊', '模具刷油倒入面糊', '上锅蒸 15 分钟', '放凉脱模切小块'],
    tip: '可一次性多做冷藏，吃时加热' },
  { id: 'a12', emoji: '🍠', name: '红薯奶酪球', age: '9 月+', time: '25 分钟',
    nutrition: [{ value: '100', label: 'kcal' }, { value: '3g', label: '蛋白' }, { value: '2g', label: '纤维' }],
    ingredients: ['红薯 50g', '婴儿奶酪 5g', '蛋黄 1 个', '面包糠 5g'],
    steps: ['红薯蒸熟压泥', '加蛋黄和奶酪碎搅匀', '搓成小球', '裹上面包糠', '烤箱 180°C 烤 10 分钟', '放凉食用'],
    tip: '补钙零食，注意奶酪选无盐款' },
];

// 食材单位归一化用（汇总购物清单时合并同类项）
function normalizeIngredient(raw) {
  const s = raw.trim();
  // 匹配 "名称 数量+单位" 形式
  const m = s.match(/^(.+?)\s+(\d+(?:\.\d+)?(?:\/\d+)?)\s*(g|ml|个|片|颗|根|小块|大块)$/);
  if (!m) return { name: s, qty: 0, unit: '' };
  return { name: m[1], qty: parseFloat(m[2]), unit: m[3] };
}

export default function FoodPage() {
  const [activeTab, setActiveTab] = useState('today');
  const age = getBabyAge();

  // 每日固定轮换的菜谱索引（用 dailySeed，跨天自动换）
  const daySeedMorning = dailySeed(MORNING_RECIPES.length);
  const daySeedAfternoon = dailySeed(AFTERNOON_RECIPES.length, 5);

  // 用户手动更换的菜谱（用 localStorage 记录，按日期区分，过夜自动失效）
  const [swap, setSwap] = useState(() => {
    try {
      const saved = localStorage.getItem('food_swap');
      if (!saved) return { morning: null, afternoon: null };
      const parsed = JSON.parse(saved);
      const todayStr = new Date().toISOString().slice(0, 10);
      if (parsed.date !== todayStr) return { morning: null, afternoon: null };
      return parsed.swap || { morning: null, afternoon: null };
    } catch {
      return { morning: null, afternoon: null };
    }
  });

  useEffect(() => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      localStorage.setItem('food_swap', JSON.stringify({ date: todayStr, swap }));
    } catch {}
  }, [swap]);

  // 当前生效的菜谱：优先用 swap（手动更换），否则用每日轮换
  const todayMorning = swap.morning !== null ? MORNING_RECIPES[swap.morning] : MORNING_RECIPES[daySeedMorning];
  const todayAfternoon = swap.afternoon !== null ? AFTERNOON_RECIPES[swap.afternoon] : AFTERNOON_RECIPES[daySeedAfternoon];

  // 是否手动更换过
  const morningSwapped = swap.morning !== null;
  const afternoonSwapped = swap.afternoon !== null;

  // 更换菜谱：在库中随机选一个不同于当前的
  const changeRecipe = (slot) => {
    setSwap((prev) => {
      const library = slot === 'morning' ? MORNING_RECIPES : AFTERNOON_RECIPES;
      const currentIndex = prev[slot] !== null ? prev[slot] : (slot === 'morning' ? daySeedMorning : daySeedAfternoon);
      // 随机选一个不同的索引
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * library.length);
      } while (newIndex === currentIndex && library.length > 1);
      return { ...prev, [slot]: newIndex };
    });
  };

  // 还原为每日轮换
  const resetRecipe = (slot) => {
    setSwap((prev) => ({ ...prev, [slot]: null }));
  };

  // 汇总今日食材购买清单（合并同类项）
  const shoppingList = useMemo(() => {
    const all = [...todayMorning.ingredients, ...todayAfternoon.ingredients];
    const merged = {};
    all.forEach((raw) => {
      const { name, qty, unit } = normalizeIngredient(raw);
      const key = name + '|' + unit;
      if (!merged[key]) {
        merged[key] = { name, qty, unit, raw: name };
      } else {
        merged[key].qty += qty;
      }
    });
    return Object.values(merged).filter((x) => x.name).sort((a, b) => a.name.localeCompare(b.name, 'zh'));
  }, [todayMorning, todayAfternoon]);

  return (
    <div>
      <div className="page-header">
        <h1>🥣 蛋堡辅食计划</h1>
        <p>科学喂养，每天换新菜谱，一键生成购物清单 🌱</p>
        <div className="meta">
          <span className="tag">👶 {age.label}</span>
          <span className="tag warm">🥣 软烂粥</span>
          <span className="tag">🤱 纯母乳</span>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>🛒 食材清单</button>
        <button className={`tab ${activeTab === 'recipe' ? 'active' : ''}`} onClick={() => setActiveTab('recipe')}>📖 今日菜谱</button>
      </div>

      {/* Tab 1: 食材购买清单（自动汇总今日上午+下午菜谱） */}
      {activeTab === 'today' && (
        <>
          <div className="panel">
            <h2>🛒 今日食材购买清单</h2>
            <p className="muted" style={{ marginTop: 0, marginBottom: 12 }}>
              根据今日推荐菜谱自动汇总，已合并同类项。如需更换菜谱请点击下方"更换菜谱"按钮。
            </p>
            <div className="shopping-list">
              {shoppingList.map((item, i) => (
                <label key={i} className="shopping-item">
                  <input type="checkbox" />
                  <span className="name">{item.name}</span>
                  {item.qty > 0 && (
                    <span className="qty">{item.qty}{item.unit}</span>
                  )}
                </label>
              ))}
            </div>
            <p className="muted" style={{ marginTop: 12, fontSize: 12 }}>
              💡 共 {shoppingList.length} 种食材 · 打勾标记已购买的食材
            </p>
          </div>

          {/* 今日菜谱预览（带更换按钮） */}
          <div className="panel">
            <h2>🌅 今日上午菜谱 {morningSwapped && <span className="swapped-tag">已更换</span>}</h2>
            <div className="recipe-card">
              <div className="recipe-head">
                <span className="emoji">{todayMorning.emoji}</span>
                <span className="name">{todayMorning.name}</span>
                <span className="age">👶 {todayMorning.age}</span>
              </div>
              <div className="recipe-body">
                <p style={{ margin: 0, marginBottom: 8, color: 'var(--text-soft)', fontSize: 13 }}>
                  ⏱️ 约 <strong style={{ color: 'var(--accent-warm-strong)' }}>{todayMorning.time}</strong>
                </p>
                <div className="recipe-actions">
                  <button className="btn ghost" onClick={() => changeRecipe('morning')}>🔄 更换菜谱</button>
                  {morningSwapped && (
                    <button className="btn ghost" onClick={() => resetRecipe('morning')}>↩️ 还原每日推荐</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="panel warm">
            <h2>🌤️ 今日下午加餐 {afternoonSwapped && <span className="swapped-tag">已更换</span>}</h2>
            <div className="recipe-card">
              <div className="recipe-head">
                <span className="emoji">{todayAfternoon.emoji}</span>
                <span className="name">{todayAfternoon.name}</span>
                <span className="age">👶 {todayAfternoon.age}</span>
              </div>
              <div className="recipe-body">
                <p style={{ margin: 0, marginBottom: 8, color: 'var(--text-soft)', fontSize: 13 }}>
                  ⏱️ 约 <strong style={{ color: 'var(--accent-warm-strong)' }}>{todayAfternoon.time}</strong>
                </p>
                <div className="recipe-actions">
                  <button className="btn ghost" onClick={() => changeRecipe('afternoon')}>🔄 更换菜谱</button>
                  {afternoonSwapped && (
                    <button className="btn ghost" onClick={() => resetRecipe('afternoon')}>↩️ 还原每日推荐</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab 2: 详细菜谱 */}
      {activeTab === 'recipe' && (
        <>
          <div className="panel">
            <h2>🌅 今日上午菜谱（主食类）{morningSwapped && <span className="swapped-tag">已更换</span>}</h2>
            <div className="recipe-card">
              <div className="recipe-head">
                <span className="emoji">{todayMorning.emoji}</span>
                <span className="name">{todayMorning.name}</span>
                <span className="age">👶 {todayMorning.age}</span>
              </div>
              <div className="recipe-body">
                <div className="section-title">⏱️ 制作时长</div>
                <p style={{ margin: 0, marginBottom: 12, color: 'var(--text-soft)', fontSize: 14 }}>
                  约 <strong style={{ color: 'var(--accent-warm-strong)' }}>{todayMorning.time}</strong>
                </p>
                <div className="section-title">🥘 食材准备</div>
                <div className="ingredients">
                  {todayMorning.ingredients.map((ing, i) => (
                    <span key={i} className="ingredient">{ing}</span>
                  ))}
                </div>
                <div className="section-title">👩‍🍳 制作步骤</div>
                <ol className="steps-list">
                  {todayMorning.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <div className="section-title">📊 营养信息</div>
                <div className="nutrition">
                  {todayMorning.nutrition.map((n, i) => (
                    <div key={i} className="item">
                      <strong>{n.value}</strong>{n.label}
                    </div>
                  ))}
                </div>
                <div className="tip">💡 {todayMorning.tip}</div>
                <div className="recipe-actions">
                  <button className="btn ghost" onClick={() => changeRecipe('morning')}>🔄 更换菜谱</button>
                  {morningSwapped && (
                    <button className="btn ghost" onClick={() => resetRecipe('morning')}>↩️ 还原每日推荐</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="panel warm">
            <h2>🌤️ 今日下午加餐（果泥/蛋黄类）{afternoonSwapped && <span className="swapped-tag">已更换</span>}</h2>
            <div className="recipe-card">
              <div className="recipe-head">
                <span className="emoji">{todayAfternoon.emoji}</span>
                <span className="name">{todayAfternoon.name}</span>
                <span className="age">👶 {todayAfternoon.age}</span>
              </div>
              <div className="recipe-body">
                <div className="section-title">⏱️ 制作时长</div>
                <p style={{ margin: 0, marginBottom: 12, color: 'var(--text-soft)', fontSize: 14 }}>
                  约 <strong style={{ color: 'var(--accent-warm-strong)' }}>{todayAfternoon.time}</strong>
                </p>
                <div className="section-title">🥘 食材准备</div>
                <div className="ingredients">
                  {todayAfternoon.ingredients.map((ing, i) => (
                    <span key={i} className="ingredient">{ing}</span>
                  ))}
                </div>
                <div className="section-title">👩‍🍳 制作步骤</div>
                <ol className="steps-list">
                  {todayAfternoon.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <div className="section-title">📊 营养信息</div>
                <div className="nutrition">
                  {todayAfternoon.nutrition.map((n, i) => (
                    <div key={i} className="item">
                      <strong>{n.value}</strong>{n.label}
                    </div>
                  ))}
                </div>
                <div className="tip">💡 {todayAfternoon.tip}</div>
                <div className="recipe-actions">
                  <button className="btn ghost" onClick={() => changeRecipe('afternoon')}>🔄 更换菜谱</button>
                  {afternoonSwapped && (
                    <button className="btn ghost" onClick={() => resetRecipe('afternoon')}>↩️ 还原每日推荐</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13, lineHeight: 1.7 }}>
              📌 上午菜谱库共 <strong style={{ color: 'var(--primary-strong)' }}>{MORNING_RECIPES.length}</strong> 道（粥面主食类），下午菜谱库共 <strong style={{ color: 'var(--primary-strong)' }}>{AFTERNOON_RECIPES.length}</strong> 道（果泥/蒸糕加餐类）。
              <br />📌 每天系统自动轮换一道，标记「<strong style={{ color: 'var(--accent-warm-strong)' }}>已更换</strong>」的菜谱是你手动替换的，与每日随机推荐区分开。
              <br />📌 菜谱库覆盖中式、西式、日式等主流 9 月+ 辅食，我会持续更新内容，有新需求可随时告诉我添加。
            </p>
          </div>
        </>
      )}
    </div>
  );
}

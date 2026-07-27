// 共享工具函数

// 蛋堡的出生日期
export const BABY_BIRTHDAY = new Date('2025-10-21');

// 根据出生日期计算月龄（如 "9月6天"）
export function getBabyAge(birth = BABY_BIRTHDAY) {
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  let days = now.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) months = 0;
  if (days < 0) days = 0;
  return { months, days, label: `${months}月${days}天` };
}

// 根据日期种子生成稳定的索引（同一天同一结果）
export function dailySeed(length, offset = 0) {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return (dayOfYear + offset) % length;
}

// 每日鸡汤语录（365天轮换）
export const SOUP_QUOTES = [
  '🌿 今天也是闪闪发光的一天',
  '💫 慢慢来，比较快',
  '🌱 把简单的事做到极致，就是不简单',
  '✨ 你只管努力，剩下的交给时间',
  '🌙 早睡早起，长高长肉',
  '☕ 把每一个早晨，过成自己喜欢的样子',
  '🌸 越努力，越幸运',
  '🍃 不焦虑，不比较，按自己的节奏来',
  '🐝 一步一个脚印，踏实走就好',
  '🌷 你今天的努力，是明天的底气',
  '🪴 别让生活的琐碎，磨灭你的热爱',
  '🦋 每一天都是新的开始',
  '🍎 身体健康，才是最大的财富',
  '🥛 好好吃饭，好好睡觉，好好生活',
  '🌻 心态好，一切都会好',
  '⭐ 想做的事，立刻就做',
  '🍀 小确幸藏在日常里',
  '🎶 听一首好歌，开始美好一天',
  '📝 记录生活，珍惜当下',
  '💪 坚持下去，惊喜正在路上',
  '🌧️ 雨后总会天晴',
  '☕ 慢品人间烟火色',
  '🌾 简单生活，快乐相伴',
  '🪞 微笑面对每一天',
  '💐 今天也要元气满满',
  '🦉 早睡的人，运气不会太差',
  '🍇 给生活加一点甜',
  '🌟 你比想象中更强大',
  '🪴 把日子过成诗',
  '🦋 顺其自然，水到渠成',
];

// 获取今日鸡汤
export function getTodayQuote() {
  return SOUP_QUOTES[dailySeed(SOUP_QUOTES.length)];
}

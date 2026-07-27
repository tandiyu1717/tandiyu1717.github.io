import express from 'express';
import cors from 'cors';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import os from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 简单内存任务存储
let tasks = [
  { id: 1, title: '阅读项目文档', done: true },
  { id: 2, title: '配置开发环境', done: true },
  { id: 3, title: '搭建工作台框架', done: false },
];
let nextId = 4;

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 系统状态
app.get('/api/stats', (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    uptime: Math.floor(process.uptime()),
    cpu: os.cpus()[0]?.model || 'unknown',
    cpuCount: os.cpus().length,
    platform: `${os.type()} ${os.release()}`,
    nodeVersion: process.version,
    memRSS: Math.round(mem.rss / 1024 / 1024),
    memTotal: Math.round(os.totalmem() / 1024 / 1024),
    memFree: Math.round(os.freemem() / 1024 / 1024),
    loadAvg: os.loadavg()[0],
    tasksTotal: tasks.length,
    tasksDone: tasks.filter((t) => t.done).length,
  });
});

// 任务列表
app.get('/api/tasks', (_req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const title = (req.body?.title || '').trim();
  if (!title) return res.status(400).json({ error: 'title 不能为空' });
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: '任务不存在' });
  if (typeof req.body?.done === 'boolean') task.done = req.body.done;
  if (typeof req.body?.title === 'string') task.title = req.body.title.trim() || task.title;
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: '任务不存在' });
  tasks.splice(idx, 1);
  res.json({ ok: true });
});

// 生产环境托管前端构建产物
const clientDist = join(__dirname, '../client/dist');
try {
  readFileSync(join(clientDist, 'index.html'));
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')));
} catch {
  // 开发模式下前端由 Vite 提供，无需处理
}

app.listen(PORT, () => {
  console.log(`[server] API running at http://localhost:${PORT}/api`);
});

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟的 AI 响应数据
const mockResponses = [
  "你好！我是 AI 助手，很高兴与你交流。",
  "让我来回答你的问题。这是一个关于 SSE 的学习项目，旨在帮助理解服务器推送事件的工作原理。",
  "SSE（Server-Sent Events）是一种允许服务器向客户端推送实时更新的技术。它基于 HTTP 协议，使用简单的文本格式进行数据传输。",
  "与传统轮询相比，SSE 更加高效，因为它建立了持久化的连接，服务器可以在有新数据时立即推送给客户端。",
  "在前面的演示中，你看到了流式输出的效果。每个字词都会实时显示在界面上，而不是等待整个响应完成。",
  "这种技术在聊天应用、实时通知、数据更新等场景中非常有用。",
  "如果你有任何问题，欢迎随时询问！"
];

// SSE 端点
app.get('/api/sse/chat', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 随机选择一个响应
  const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  let index = 0;

  // 模拟流式输出
  const interval = setInterval(() => {
    if (index < response.length) {
      const chunk = response[index];
      res.write(`data: ${JSON.stringify({ type: 'chunk', data: chunk })}\n\n`);
      index++;
    } else {
      // 发送完成信号
      res.write(`data: ${JSON.stringify({ type: 'done', data: '完成' })}\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 50); // 控制输出速度
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SSE Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 SSE Server is running on http://localhost:${PORT}`);
  console.log(`📡 SSE endpoint: http://localhost:${PORT}/api/sse/chat`);
});
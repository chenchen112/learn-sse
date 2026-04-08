# SSE 服务端

这是一个使用 Express.js 构建的后端服务，提供 SSE（Server-Sent Events）接口，用于演示流式输出效果。

## 技术栈

- Express.js - Node.js Web 框架
- CORS - 跨域资源共享支持

## API 端点

### GET /api/sse/chat

SSE 聊天端点，用于获取 AI 响应的流式数据。

**响应格式：**
- Content-Type: `text/event-stream`
- 数据格式：JSON 字符串

```javascript
// 字符块数据
{
  "type": "chunk",
  "data": "字符"
}

// 完成信号
{
  "type": "done",
  "data": "完成"
}
```

### GET /api/health

健康检查端点，返回服务器状态。

## 运行

```bash
npm run dev
```

服务将在 http://localhost:3001 启动。

## Mock 数据

服务器预置了多个模拟的 AI 响应，每次随机选择一个进行流式输出。每个字符都会通过 SSE 实时推送给客户端。
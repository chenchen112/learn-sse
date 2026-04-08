# learn-sse

这个项目主要用来了解 SSE 和流式输出

- 📦 项目结构：monorepo 架构，使用 workspaces 管理前后端包
- 🎨 前端技术栈：Vite + React + TypeScript + Antd
- 🔧 后端技术栈：Express.js + CORS
- 💬 功能：提供经典的 chat 页面演示大模型流式输出效果

## 快速开始

1. **安装依赖**
```bash
npm run install:all
```

2. **启动开发环境**
```bash
npm run dev
```

这将同时启动：
- 前端服务：http://localhost:3000
- 后端服务：http://localhost:3001

3. **访问应用**
打开浏览器访问 http://localhost:3000，在聊天框中输入消息即可体验 SSE 流式输出效果。

## 项目结构

```
learn-sse/
├── packages/
│   ├── client/          # 前端应用
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── App.tsx
│   │   └── vite.config.ts
│   └── server/          # 后端服务
│       ├── src/
│       │   └── index.js
│       └── public/
└── package.json
```

## SSE 技术要点

- **EventSource API**：浏览器原生支持的 SSE 客户端 API
- **text/event-stream**：SSE 专用 MIME 类型
- **数据格式**：简单的文本流，每条消息以 `\n\n` 结尾
- **自动重连**：EventSource 内置连接断开自动重连机制

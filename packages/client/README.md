# SSE 客户端

这是一个使用 Vite + React + TypeScript + Antd 构建的前端应用，用于演示 SSE（Server-Sent Events）流式输出效果。

## 技术栈

- Vite - 快速的前端构建工具
- React 18 - 用户界面库
- TypeScript - 类型安全的 JavaScript
- Antd - 企业级 UI 组件库

## 开发运行

1. 安装依赖
```bash
npm run install:packages
```

2. 启动开发服务器
```bash
npm run dev
```

这会同时启动前端（http://localhost:3000）和后端（http://localhost:3001）服务。

## 功能特性

- 使用 EventSource API 建立 SSE 连接
- 实时显示 AI 响应的流式输出
- 支持发送消息和接收回复
- 错误处理和连接状态管理
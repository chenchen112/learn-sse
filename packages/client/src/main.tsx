import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App'
import './index.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
          colorBgContainer: '#ffffff',
          colorBorder: '#e2e8f0',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
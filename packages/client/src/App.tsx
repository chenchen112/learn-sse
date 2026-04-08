import { Layout, Typography, Space } from "antd";
import ChatPage from "./pages/ChatPage";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "0 32px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          height: "64px",
          lineHeight: "64px",
        }}
      >
        <Space>
          <Title
            level={3}
            style={{
              margin: 0,
              color: "white",
              fontWeight: 600,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            SSE 流式输出演示
          </Title>
        </Space>
      </Header>
      <Content style={{ padding: "32px 24px", background: "#f0f2f5" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <ChatPage />
        </div>
      </Content>
    </Layout>
  );
}

export default App;

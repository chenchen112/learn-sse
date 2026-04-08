import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Card, Space, Typography, Spin, Alert } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface Message {
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface StreamChunk {
  type: "chunk" | "done";
  data: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai",
      content:
        "你好！我是 AI 助手，点击下方按钮开始对话，体验 SSE 流式输出效果。",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentAiMessage, setCurrentAiMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) return;

    // 添加用户消息
    const userMessage: Message = {
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsStreaming(true);
    setCurrentAiMessage("");
    setError(null);

    try {
      // 创建 EventSource 连接
      const eventSource = new EventSource("/api/sse/chat");
      let streamedContent = "";

      eventSource.onopen = () => {
        console.log("SSE 连接已建立");
      };

      eventSource.onmessage = (event) => {
        try {
          const data: StreamChunk = JSON.parse(event.data);

          if (data.type === "chunk") {
            streamedContent += data.data;
            setCurrentAiMessage(streamedContent);
          } else if (data.type === "done") {
            // 完成流式输出
            const aiMessage: Message = {
              type: "ai",
              content: streamedContent,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setCurrentAiMessage("");
            setIsStreaming(false);
            eventSource.close();
            streamedContent = "";
          }
        } catch (e) {
          console.error("解析 SSE 数据时出错:", e);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE 连接错误:", err);
        setError("连接服务器失败，请检查后端服务是否正在运行");
        setIsStreaming(false);
        eventSource.close();
      };

      // 设置超时
      setTimeout(() => {
        if (isStreaming) {
          // 将已接收的内容保存为消息
          if (streamedContent) {
            const aiMessage: Message = {
              type: "ai",
              content: streamedContent,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
          }
          eventSource.close();
          setCurrentAiMessage("");
          setIsStreaming(false);
          setError("请求超时");
        }
      }, 30000);
    } catch (err) {
      console.error("发起 SSE 请求时出错:", err);
      setError("发送消息失败");
      setIsStreaming(false);
      setCurrentAiMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 当消息或当前 AI 消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAiMessage]);

  return (
    <Card
      title={
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SSE 聊天演示
        </div>
      }
      style={{
        height: "700px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        border: "none",
        background: "#ffffff",
      }}
      styles={{
        body: {
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          height: "calc(100% - 57px)",
          background: "#ffffff",
        },
      }}
    >
      {/* 消息列表 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "24px",
          padding: "0 8px",
          scrollBehavior: "smooth",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent:
                message.type === "user" ? "flex-end" : "flex-start",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: message.type === "user" ? "16px 20px" : "18px 24px",
                borderRadius:
                  message.type === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                background:
                  message.type === "user"
                    ? "#0958d9"
                    : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                color: message.type === "user" ? "white" : "#1e293b",
                boxShadow:
                  message.type === "user"
                    ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                    : "0 2px 8px rgba(0, 0, 0, 0.05)",
                position: "relative",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
            >
              <Paragraph
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: "unset",
                }}
              >
                {message.content}
              </Paragraph>
              <div
                style={{
                  fontSize: "11px",
                  marginTop: "8px",
                  opacity: 0.7,
                  textAlign: message.type === "user" ? "right" : "left",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* 正在显示的 AI 响应 */}
        {isStreaming && currentAiMessage && (
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "flex-start",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "18px 24px",
                borderRadius: "18px 18px 18px 4px",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                color: "#1e293b",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                position: "relative",
                backdropFilter: "blur(10px)",
              }}
            >
              <Paragraph
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {currentAiMessage}
              </Paragraph>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "12px",
                  gap: "8px",
                }}
              >
                <Spin size="small" style={{ color: "#667eea" }} />
                <Text
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  正在输入...
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              border: "1px solid #fecaca",
              background: "#fef2f2",
            }}
            description="请检查网络连接或刷新页面重试"
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: "24px",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.8))",
        }}
      >
        <Space.Compact style={{ width: "100%", marginBottom: "16px" }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息，体验 SSE 流式输出..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              fontSize: "15px",
              borderRadius: "12px 0 0 12px",
              border: "2px solid #e2e8f0",
              transition: "all 0.3s ease",
              fontFamily: "Inter, sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
            disabled={isStreaming}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isStreaming}
            disabled={!inputValue.trim() || isStreaming}
            style={{
              borderRadius: "0 12px 12px 0",
              border: "none",
              height: "auto",
              fontSize: "15px",
              fontWeight: 500,
              boxShadow: isStreaming
                ? "0 2px 8px rgba(148, 163, 184, 0.3)"
                : "0 4px 12px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              minWidth: "80px",
            }}
            onMouseEnter={(e) => {
              if (!isStreaming) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isStreaming) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(102, 126, 234, 0.3)";
              }
            }}
          >
            发送
          </Button>
        </Space.Compact>

        <div
          style={{
            marginTop: "12px",
            fontSize: "13px",
            color: "#64748b",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
          }}
        >
          💡 提示：此演示使用 SSE（Server-Sent
          Events）技术实现流式输出，每个字符都会实时显示
        </div>
      </div>
    </Card>
  );
};

export default ChatPage;

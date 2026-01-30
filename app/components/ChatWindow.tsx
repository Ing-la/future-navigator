'use client';

import { useState } from 'react';
import { getGeminiConfig } from '../../lib/config';
import MessageList from './MessageList';
import InputArea from './InputArea';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (content: string) => {
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    
    try {
      // 从配置中获取 API Key（如果配置了）
      const config = getGeminiConfig();
      const apiKey = config.configured ? config.apiKey : undefined;

      // 调用 API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          apiKey, // 传递配置的 API Key（如果存在）
        }),
      });

      if (!response.ok) {
        throw new Error('API 调用失败');
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let assistantMessageId = '';

      // 先添加一条空的 assistant 消息
      assistantMessageId = Date.now().toString();
      setMessages((prev) => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
      }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const data = JSON.parse(line.slice(2));
                if (data.type === 'text-delta' && data.textDelta) {
                  assistantContent += data.textDelta;
                  // 更新 assistant 消息
                  setMessages((prev) => 
                    prev.map(msg => 
                      msg.id === assistantMessageId
                        ? { ...msg, content: assistantContent }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage = error.message?.includes('GEMINI_API_KEY') 
        ? 'AI 服务未配置，请联系管理员配置 Gemini API Key'
        : 'AI 服务暂时不可用，请稍后重试';
      
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: errorMessage,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表区域 */}
      <MessageList messages={messages} />
      
      {/* 加载指示器 */}
      {isLoading && (
        <div className="w-full flex justify-center px-4 py-2">
          <div className="max-w-3xl w-full flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>AI正在思考...</span>
          </div>
        </div>
      )}
      
      {/* 输入区域 */}
      <InputArea onSend={handleSend} disabled={isLoading} />
    </div>
  );
}

'use client';

import { useState } from 'react';
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

    // TODO: 这里后续会调用API
    setIsLoading(true);
    
    // 模拟AI回复（暂时）
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '这是一个占位回复。API集成后，这里将显示真实的AI回复。',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
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

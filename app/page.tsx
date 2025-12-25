// 文件路径: app/page.tsx
'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';

export default function Chat() {
  // 使用 Vercel AI SDK 的钩子，自动处理流式传输和输入状态
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  // 自动滚动到底部的逻辑
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      {/* 顶部导航 */}
      <header className="p-4 border-b border-gray-800 bg-gray-950 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          觉醒号 · 终端
        </h1>
        <span className="text-xs text-gray-500">System: Online</span>
      </header>

      {/* 聊天内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p>舰长，狗子已就位。</p>
            <p className="text-sm">请输入指令启动连接...</p>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-lg ${m.role === 'user'
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
              }`}>
              {/* 这里简单处理换行，实际生产可以用 ReactMarkdown */}
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none text-gray-400 text-sm animate-pulse">
              正在接收星际信号...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入框 */}
      <div className="p-4 bg-gray-950 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex gap-2">
          <input
            className="flex-1 bg-gray-800 border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={input}
            placeholder="输入消息呼叫狗子..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={isLoading || !input}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            发送
          </button>
        </form>
      </div>
    </div>
  );
}
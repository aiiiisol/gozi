'use client';

import { useState } from 'react';

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMsg = { role: 'user', content: trimmedInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API 请求失败');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.text }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '报错了：' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #000' }}>🐶 狗子的 AI 实验室</h2>
      <div style={{ minHeight: '300px', border: '1px solid #ddd', padding: '15px', borderRadius: '10px', marginTop: '20px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '10px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <div style={{ display: 'inline-block', padding: '8px 12px', background: m.role === 'user' ? '#0070f3' : '#eee', color: m.role === 'user' ? '#fff' : '#000', borderRadius: '10px' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: '#999' }}>正在思考中...</div>}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <input style={{ flex: 1, padding: '12px' }} value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入“我是谁”..." />
        <button type="submit" disabled={loading} style={{ padding: '0 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px' }}>发送</button>
      </form>
    </div>
  );
}
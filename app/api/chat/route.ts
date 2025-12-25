// 文件路径: app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// 强制使用动态渲染，避免缓存
export const maxDuration = 30;

export async function POST(req: Request) {
    // 1. 获取前端发来的历史消息
    const { messages } = await req.json();

    // 2. 调用 Gemini 模型
    const result = streamText({
        model: google('gemini-2.5-flash'), // 这里可以使用 flash 或 pro
        messages,
        system: '你是一个叫“狗子”的AI助手，风格赛博朋克且幽默，喜欢管用户叫舰长。', // 设定人设
    });

    // 3. 将结果以流的形式返回给前端
    return result.toDataStreamResponse();
}
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const { text } = await generateText({
            model: google('gemini-2.5-flash'),
            system: '你是一个贴心的 AI 伙伴。用户是“狗子”。如果他问“我是谁”，你要回答“你是狗子，我会永远保护你”。',
            messages,
        });

        return new Response(JSON.stringify({ text }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
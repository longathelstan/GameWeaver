import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// ── CLIProxyAPI (OpenAI-compatible) ──────────────────────────────────────────
const proxyApiKey = process.env.CLIPROXY_API_KEY;
const proxyBaseUrl = process.env.CLIPROXY_BASE_URL;

if (!proxyApiKey) {
    console.error('⚠️  CLIPROXY_API_KEY is not set in environment variables.');
}

const openai = new OpenAI({
    apiKey: proxyApiKey || '',
    baseURL: proxyBaseUrl,
});

// ── Model names ──────────────────────────────────────────────────────────────
export const FLASH_MODEL = 'gemini-2.5-flash';
export const PRO_MODEL = 'gemini-3.1-pro-low';

// ── Helper: generate text via OpenAI chat completion ─────────────────────────
export async function generateText(model: string, prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices?.[0]?.message?.content;
    if (!text) throw new Error(`Empty response from model ${model}`);
    return text;
}

export default openai;

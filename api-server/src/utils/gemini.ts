import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export const flashModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
export const proModel = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });
export const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

export default genAI;

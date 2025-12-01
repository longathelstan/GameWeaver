
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const main = async () => {
    try {
        console.log('API Key present:', !!process.env.GEMINI_API_KEY);

        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: 'text-embedding-004',
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            apiKey: process.env.GEMINI_API_KEY,
        });

        console.log('Embedding "Hello world"...');
        const res = await embeddings.embedQuery("Hello world");
        console.log('Embedding success. Vector length:', res.length);
    } catch (error) {
        console.error('Embedding failed:', error);
    }
};

main();

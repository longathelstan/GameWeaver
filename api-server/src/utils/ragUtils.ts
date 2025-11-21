import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';

// Initialize embeddings model
const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'embedding-001', // or text-embedding-004 if supported by langchain wrapper
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: process.env.GEMINI_API_KEY,
});

// Global variable to hold the vector store in memory (for simplicity in this phase)
// In a real production app, this should be a database like pgvector or Pinecone.
let vectorStore: MemoryVectorStore | null = null;

export const processAndVectorizeContent = async (text: string) => {
    try {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await splitter.createDocuments([text]);

        console.log(`Creating vector store with ${docs.length} chunks...`);

        // Create a new vector store or add to existing one
        if (!vectorStore) {
            vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
        } else {
            await vectorStore.addDocuments(docs);
        }

        console.log('Vector store updated successfully.');
        return true;
    } catch (error) {
        console.error('Error vectorizing content:', error);
        throw error;
    }
};

export const retrieveContext = async (query: string, k: number = 4) => {
    if (!vectorStore) {
        console.warn('Vector store is empty. Returning empty context.');
        return '';
    }

    try {
        const results = await vectorStore.similaritySearch(query, k);
        return results.map((doc) => doc.pageContent).join('\n\n');
    } catch (error) {
        console.error('Error retrieving context:', error);
        return '';
    }
};

// Helper to clear vector store (e.g., when uploading new file)
export const clearVectorStore = () => {
    vectorStore = null;
};

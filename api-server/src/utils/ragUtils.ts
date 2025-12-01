import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';
import { PrismaClient, Document, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Initialize embeddings model
const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'text-embedding-004',
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: process.env.GEMINI_API_KEY,
});

// Initialize PrismaVectorStore
let vectorStore: any;
try {
    vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(
        embeddings,
        {
            prisma: Prisma,
            tableName: 'Document',
            vectorColumnName: 'embedding',
            columns: {
                id: PrismaVectorStore.IdColumn,
                content: PrismaVectorStore.ContentColumn,
            },
        }
    );
    console.log('PrismaVectorStore initialized successfully.');
} catch (error) {
    console.error('Failed to initialize PrismaVectorStore:', error);
}

export const processAndVectorizeContent = async (text: string) => {
    try {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await splitter.createDocuments([text]);
        console.log(`Creating vector store with ${docs.length} chunks...`);

        for (const doc of docs) {
            const embedding = await embeddings.embedQuery(doc.pageContent);

            // Use raw SQL for vector insertion
            const vectorString = `[${embedding.join(',')}]`;
            const id = require('crypto').randomUUID();

            await prisma.$executeRaw`
                INSERT INTO "Document" ("id", "content", "embedding", "metadata")
                VALUES (${id}, ${doc.pageContent}, ${vectorString}::vector, ${doc.metadata}::jsonb)
            `;
        }

        console.log('Vector store updated successfully (Manual Mode).');
        return true;
    } catch (error) {
        console.error('Error vectorizing content:', error);
        throw error;
    }
};

export const retrieveContext = async (query: string, k: number = 4) => {
    try {
        console.log(`Searching for context with query: "${query}"`);
        const embedding = await embeddings.embedQuery(query);
        const vectorString = `[${embedding.join(',')}]`;

        const results = await prisma.$queryRaw`
            SELECT content, 1 - (embedding <=> ${vectorString}::vector) as similarity
            FROM "Document"
            ORDER BY embedding <=> ${vectorString}::vector
            LIMIT ${k}
        `;

        console.log(`Found ${(results as any[]).length} documents.`);
        return (results as any[]).map((doc: any) => doc.content).join('\n\n');
    } catch (error) {
        console.error('Error retrieving context:', error);
        return '';
    }
};

// Helper to clear vector store (optional, be careful in production)
export const clearVectorStore = async () => {
    try {
        await prisma.document.deleteMany({});
        console.log('Vector store cleared successfully.');
    } catch (error) {
        console.error('Error clearing vector store:', error);
    }
};

import crypto from 'crypto';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';
import prisma from '../lib/prisma';

// Initialize embeddings model once
const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: 'gemini-embedding-001',
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Chunk text and vectorize into the Document table.
 * Each chunk is tagged with bookId so we can scope retrieval per-book.
 */
export const processAndVectorizeContent = async (text: string, bookId: number): Promise<void> => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);
    console.log(`[RAG] Vectorizing ${docs.length} chunks for bookId=${bookId}...`);

    for (const doc of docs) {
        const embedding = await embeddings.embedQuery(doc.pageContent);
        const vectorString = `[${embedding.join(',')}]`;
        const id = crypto.randomUUID();
        const metadata = { bookId, ...doc.metadata };

        await prisma.$executeRaw`
            INSERT INTO "Document" ("id", "content", "embedding", "metadata")
            VALUES (${id}, ${doc.pageContent}, ${vectorString}::vector, ${JSON.stringify(metadata)}::jsonb)
        `;
    }

    console.log(`[RAG] Done vectorizing for bookId=${bookId}.`);
};

/**
 * Retrieve context chunks relevant to the query, scoped to a specific book.
 */
export const retrieveContext = async (
    query: string,
    bookId: number,
    k = 5
): Promise<string> => {
    console.log(`[RAG] Searching context: "${query}" (bookId=${bookId}, k=${k})`);

    const embedding = await embeddings.embedQuery(query);
    const vectorString = `[${embedding.join(',')}]`;

    const results = await prisma.$queryRaw<{ content: string; similarity: number }[]>`
        SELECT content, 1 - (embedding <=> ${vectorString}::vector) AS similarity
        FROM "Document"
        WHERE metadata->>'bookId' = ${String(bookId)}
        ORDER BY embedding <=> ${vectorString}::vector
        LIMIT ${k}
    `;

    console.log(`[RAG] Found ${results.length} chunks.`);
    return results.map((r) => r.content).join('\n\n');
};

/**
 * Clear all vector chunks for a specific book (or all if bookId not provided).
 */
export const clearVectorStore = async (bookId?: number): Promise<void> => {
    if (bookId !== undefined) {
        await prisma.$executeRaw`
            DELETE FROM "Document" WHERE metadata->>'bookId' = ${String(bookId)}
        `;
        console.log(`[RAG] Cleared vector store for bookId=${bookId}.`);
    } else {
        await prisma.document.deleteMany({});
        console.log('[RAG] Cleared entire vector store.');
    }
};

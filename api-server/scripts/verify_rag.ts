
import { retrieveContext } from '../src/utils/ragUtils';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const main = async () => {
    try {
        const count = await prisma.document.count();
        console.log(`Total documents in DB: ${count}`);

        const query = "Nguyễn Trãi là ai?";
        console.log(`Testing retrieval for query: "${query}"`);

        const context = await retrieveContext(query);

        console.log('--- Retrieved Context ---');
        console.log(context);
        console.log('-------------------------');

        if (context && context.length > 0) {
            console.log('✅ RAG Verification Passed');
        } else {
            console.error('❌ RAG Verification Failed: No context retrieved');
        }
    } catch (error) {
        console.error('Error verifying RAG:', error);
    }
};

main();

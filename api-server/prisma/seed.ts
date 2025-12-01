
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { processAndVectorizeContent, clearVectorStore } from '../src/utils/ragUtils';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeding...');

    // 1. Create Default User and Project
    const user = await prisma.user.upsert({
        where: { email: 'demo@gameweaver.com' },
        update: {},
        create: {
            email: 'demo@gameweaver.com',
            name: 'Demo Teacher',
        },
    });

    const project = await prisma.project.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Ngữ Văn 10 - Tập 2',
            ownerId: user.id,
        },
    });

    console.log(`Project ID: ${project.id}`);

    // 2. Load Structured Data
    const dataPath = path.resolve(__dirname, '../data/10t2v_structured.json');
    if (!fs.existsSync(dataPath)) {
        console.error('Structured data file not found. Please run convertData.ts first.');
        return;
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const structuredData = JSON.parse(rawData);

    // 3. Build Tree Structure
    // Data format: [{ chapter: string, lesson: string, content: string }]
    const treeData: any[] = [];
    const chapterMap = new Map<string, any>();

    structuredData.forEach((item: any, index: number) => {
        if (!chapterMap.has(item.chapter)) {
            const chapterNode = {
                value: `chapter-${index}`, // Simple ID generation
                label: item.chapter,
                children: [],
            };
            chapterMap.set(item.chapter, chapterNode);
            treeData.push(chapterNode);
        }

        const chapterNode = chapterMap.get(item.chapter);
        chapterNode.children.push({
            value: `lesson-${index}`,
            label: item.lesson,
            // We could store content ID here if needed, but for now just label/value for UI
        });
    });

    console.log('Tree structure built.');

    // 4. Store in DB
    // Check if exists first to avoid duplicates (or just delete old)
    await prisma.textbookData.deleteMany({ where: { projectId: project.id } });

    await prisma.textbookData.create({
        data: {
            name: 'Ngữ Văn 10 - Tập 2',
            content: structuredData, // Store the full structured content
            structure: treeData,     // Store the UI tree
            projectId: project.id,
        },
    });

    console.log('Textbook data stored in DB.');

    // 5. Vectorize Content
    // We need to vectorize each lesson so RAG can find it.
    // We can join all content or vectorize individually. 
    // ragUtils.processAndVectorizeContent splits by chunk, so passing a big string is fine,
    // but passing structured context (Chapter > Lesson) is better.

    console.log('Vectorizing content...');
    await clearVectorStore(); // Optional: clear old data

    let fullTextForVectorization = '';
    structuredData.forEach((item: any) => {
        fullTextForVectorization += `CHAPTER: ${item.chapter}\nLESSON: ${item.lesson}\nCONTENT: ${item.content}\n\n`;
    });

    await processAndVectorizeContent(fullTextForVectorization);

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

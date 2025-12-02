
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { processAndVectorizeContent } from '../src/utils/ragUtils';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const main = async () => {
    const structuredDataPath = path.resolve(__dirname, '../data/10t2v_structured.json');

    if (!fs.existsSync(structuredDataPath)) {
        console.error(`Structured data file not found at ${structuredDataPath}`);
        console.log('Please run "npm run convert-data" (or execute scripts/convertData.ts) first to generate the structured data.');
        process.exit(1);
    }

    console.log('Reading structured data...');
    const rawData = fs.readFileSync(structuredDataPath, 'utf-8');
    let lessons: any[];

    try {
        lessons = JSON.parse(rawData);
        if (!Array.isArray(lessons)) {
            throw new Error('Data is not an array');
        }
    } catch (error) {
        console.error('Error parsing structured data:', error);
        process.exit(1);
    }

    console.log(`Found ${lessons.length} lessons to process.`);

    // 1. Ensure Project and User exist
    console.log('Ensuring default project exists...');
    const project = await prisma.project.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: "Default Project",
            owner: {
                connectOrCreate: {
                    where: { email: "demo@gameweaver.com" },
                    create: { email: "demo@gameweaver.com", name: "Demo User" }
                }
            }
        }
    });

    // 2. Generate Tree Structure for Frontend
    console.log('Generating textbook structure...');
    const structure: any[] = [];
    const chapters: { [key: string]: any[] } = {};

    lessons.forEach((lesson: any) => {
        if (!chapters[lesson.chapter]) {
            chapters[lesson.chapter] = [];
        }
        chapters[lesson.chapter].push(lesson);
    });

    for (const [chapterName, chapterLessons] of Object.entries(chapters)) {
        structure.push({
            value: chapterName,
            label: chapterName,
            children: (chapterLessons as any[]).map(l => ({
                value: l.lesson,
                label: l.lesson
            }))
        });
    }

    // 3. Save to TextbookData
    console.log('Saving to TextbookData table...');
    // Check if it already exists to avoid duplicates or update it
    const existingBook = await prisma.textbookData.findFirst({
        where: { name: "10t2v.json", projectId: project.id }
    });

    if (existingBook) {
        console.log('Updating existing textbook data...');
        await prisma.textbookData.update({
            where: { id: existingBook.id },
            data: {
                content: lessons,
                structure: structure
            }
        });
    } else {
        console.log('Creating new textbook data...');
        await prisma.textbookData.create({
            data: {
                name: "10t2v.json",
                content: lessons,
                projectId: project.id,
                structure: structure
            }
        });
    }

    // 4. Vectorize Content
    console.log('Vectorizing content...');
    for (const [index, lesson] of lessons.entries()) {
        const { chapter, lesson: lessonName, content } = lesson;

        if (!content) {
            console.warn(`Skipping lesson "${lessonName}" (Index: ${index}) due to missing content.`);
            continue;
        }

        const fullContent = `Chapter: ${chapter}\nLesson: ${lessonName}\n\n${content}`;

        console.log(`Processing lesson ${index + 1}/${lessons.length}: "${lessonName}"...`);

        try {
            await processAndVectorizeContent(fullContent);
            console.log(`Successfully processed "${lessonName}".`);
        } catch (error) {
            console.error(`Failed to process "${lessonName}":`, error);
        }
    }

    console.log('Data preloading completed.');
};

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

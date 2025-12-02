
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.document.count();
        console.log(`Total documents in database: ${count}`);

        const docs = await prisma.document.findMany({
            take: 5,
        });

        console.log('\n--- Sample Documents (First 5) ---');
        docs.forEach((doc, index) => {
            console.log(`\n[Document ${index + 1}]`);
            console.log(`ID: ${doc.id}`);
            console.log(`Metadata:`, doc.metadata);
            console.log(`Content (Preview): ${doc.content.substring(0, 150).replace(/\n/g, ' ')}...`);
        });
        console.log('\n----------------------------------');
    } catch (error) {
        console.error('Error inspecting database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Attempting manual insertion...');
    try {
        const doc = await prisma.document.create({
            data: {
                content: 'Test Content',
                metadata: { source: 'manual_test' },
            }
        });
        console.log('Manual insertion successful:', doc.id);

        const count = await prisma.document.count();
        console.log('New Count:', count);
    } catch (e) {
        console.error('Manual insertion failed:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

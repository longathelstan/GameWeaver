import prisma from './src/lib/prisma';
import { flashModel } from './src/utils/gemini';

async function fix() {
    const bookId = 5;
    const textbook = await prisma.textbookData.findUnique({ where: { id: bookId } });

    if (!textbook) {
        console.log('Book not found');
        return;
    }

    console.log(`Generating structure for bookId=${textbook.id}...`);
    try {
        const dataPreview = JSON.stringify(textbook.content).substring(0, 10000);
        const prompt = `
Analyze the following JSON data representing a Vietnamese textbook.
Return a hierarchical tree structure for a checkbox tree UI.

Structure:
[
  {
    "value": "unique_id",
    "label": "Chapter or Lesson Name",
    "children": [ ... ]
  }
]

Return ONLY the JSON array. No markdown.

Data:
${dataPreview}
    `.trim();

        const result = await flashModel.generateContent(prompt);
        const text = result.response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const treeData = JSON.parse(cleanText);

        await prisma.textbookData.update({
            where: { id: textbook.id },
            data: { structure: treeData },
        });
        console.log(`Saved structure for bookId=${textbook.id} successfully.`);
        console.log(JSON.stringify(treeData, null, 2));
    } catch (e) {
        console.error(`Failed to generate structure for bookId=${textbook.id}`, e);
    }
}

fix();

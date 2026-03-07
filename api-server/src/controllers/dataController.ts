import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { processAndVectorizeContent, clearVectorStore } from '../utils/ragUtils';
import { generateText, FLASH_MODEL } from '../utils/gemini';
import { AppError } from '../middlewares/errorHandler';

// ── Schemas ──────────────────────────────────────────────────────────────────

const IngestSchema = z.object({
  projectId: z.coerce.number().int().positive().default(1),
});

// ── Controllers ───────────────────────────────────────────────────────────────

export const ingestDataController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw new AppError('No file uploaded.', 400);

    const { projectId } = IngestSchema.parse(req.body);

    const fileContent = req.file.buffer.toString('utf-8');
    let jsonData: unknown;
    try {
      jsonData = JSON.parse(fileContent);
    } catch {
      throw new AppError('Invalid JSON file.', 400);
    }

    // Ensure default user exists
    const owner = await prisma.user.upsert({
      where: { email: 'demo@gameweaver.com' },
      update: {},
      create: { email: 'demo@gameweaver.com', name: 'Demo User' },
    });

    // Ensure project exists
    await prisma.project.upsert({
      where: { id: projectId },
      update: {},
      create: {
        id: projectId,
        name: 'Default Project',
        ownerId: owner.id,
      },
    });

    // Save textbook record to get ID
    let textbook = await prisma.textbookData.create({
      data: {
        name: req.file.originalname,
        content: jsonData as object,
        projectId,
      },
    });

    console.log(`[INGEST] Generating structure for bookId=${textbook.id}...`);
    try {
      const dataPreview = JSON.stringify(jsonData).substring(0, 10000);
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

      console.log(`[INGEST] Calling Gemini flash model for structure...`);
      const text = await generateText(FLASH_MODEL, prompt);
      console.log(`[INGEST] Raw AI response (first 200 chars): ${text.substring(0, 200)}`);
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const treeData = JSON.parse(cleanText);

      textbook = await prisma.textbookData.update({
        where: { id: textbook.id },
        data: { structure: treeData },
      });
      console.log(`[INGEST] Saved structure for bookId=${textbook.id}.`);
    } catch (e) {
      console.error(`[INGEST] Failed to generate structure for bookId=${textbook.id}`, e);
    }

    // Clear old vectors for this book then re-vectorize
    await clearVectorStore(textbook.id);

    const arr = Array.isArray(jsonData) ? jsonData : [];
    const textContent =
      arr.length > 0
        ? arr
          .map(
            (item: Record<string, string>) =>
              `Chapter: ${item.chapter}\nLesson: ${item.lesson}\nContent: ${item.content}`
          )
          .join('\n\n')
        : JSON.stringify(jsonData, null, 2);

    await processAndVectorizeContent(textContent, textbook.id);

    res.status(201).json({
      success: true,
      message: 'File ingested and vectorized successfully.',
      bookId: textbook.id,
      filename: req.file.originalname,
    });
  } catch (err) {
    next(err);
  }
};

export const getBooksController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await prisma.textbookData.findMany({
      select: { id: true, name: true, createdAt: true, projectId: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, books });
  } catch (err) {
    next(err);
  }
};

export const getBookDetailsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new AppError('Invalid book ID.', 400);

    const book = await prisma.textbookData.findUnique({
      where: { id },
      select: { id: true, name: true, structure: true, createdAt: true },
    });

    if (!book) throw new AppError('Book not found.', 404);

    res.status(200).json({ success: true, book });
  } catch (err) {
    next(err);
  }
};

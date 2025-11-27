import { Request, Response } from 'express';
import { processAndVectorizeContent, clearVectorStore } from '../utils/ragUtils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ingestDataController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    console.log('File received:', req.file.originalname);

    // Read file content
    const fileContent = req.file.buffer.toString('utf-8');
    let jsonData;
    try {
      jsonData = JSON.parse(fileContent);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid JSON file.' });
    }

    // Clear previous vector store for simplicity (or manage multiple stores in future)
    clearVectorStore();

    // Convert JSON to string for vectorization (simplistic approach)
    // In a real app, we might want to structure this better
    // Convert JSON to string for vectorization with better structure
    const textContent = Array.isArray(jsonData)
      ? jsonData.map((item: any) => `Chapter: ${item.chapter}\nLesson: ${item.lesson}\nContent: ${item.content}`).join('\n\n')
      : JSON.stringify(jsonData, null, 2);

    // Process and vectorize
    await processAndVectorizeContent(textContent);

    // Save to database (optional, for persistence)
    // We assume a default project ID 1 for now or create a new one
    // Ideally, project ID should come from request body
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

    await prisma.textbookData.create({
      data: {
        name: req.file.originalname,
        content: jsonData,
        projectId: project.id
      }
    });

    res.status(200).json({
      message: 'File processed and vectorized successfully.',
      filename: req.file.originalname,
      data: jsonData // Return data for frontend preview if needed
    });
  } catch (error) {
    console.error('Error ingesting data:', error);
    res.status(500).json({ message: 'Error processing file.' });
  }
};

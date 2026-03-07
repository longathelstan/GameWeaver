import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { generateText, FLASH_MODEL } from '../utils/gemini';
import { AppError } from '../middlewares/errorHandler';

const MapContentSchema = z.object({
  data: z.union([z.array(z.any()), z.record(z.string(), z.any())]),
});

export const mapContentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = MapContentSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError('Invalid data provided for mapping.', 400);
    const { data } = parsed.data;

    const dataPreview = JSON.stringify(data).substring(0, 10000);

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

    const result = await generateText(FLASH_MODEL, prompt);
    const cleanText = result.replace(/```json/g, '').replace(/```/g, '').trim();
    const treeData = JSON.parse(cleanText);

    res.status(200).json({ success: true, treeData });
  } catch (err) {
    next(err);
  }
};

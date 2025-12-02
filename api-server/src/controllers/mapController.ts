import { Request, Response } from 'express';
import { flashModel } from '../utils/gemini';

export const mapContentController = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: 'No data provided for mapping.' });
    }

    // Prompt Gemini to analyze the structure
    const prompt = `
      Analyze the following JSON data representing a textbook or educational content.
      Return a hierarchical structure (Tree) suitable for a frontend Checkbox Tree component.
      The structure should be:
      [
        {
          "value": "unique_id",
          "label": "Chapter Name / Lesson Name",
          "children": [ ... ]
        }
      ]
      
      Only return the JSON array. Do not include markdown formatting.
      
      Data:
      ${JSON.stringify(data).substring(0, 10000)} // Truncate to avoid token limit if necessary
    `;

    const result = await flashModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const treeData = JSON.parse(cleanText);

    res.status(200).json({ treeData });
  } catch (error) {
    console.error('Error mapping content:', error);
    res.status(500).json({ message: 'Error mapping content.' });
  }
};

import { Request, Response } from 'express';
import { model } from '../utils/gemini';
import { retrieveContext } from '../utils/ragUtils';

export const generateQuestionsController = async (req: Request, res: Response) => {
    try {
        const { topics, quantity = 5 } = req.body;

        if (!topics || !Array.isArray(topics)) {
            return res.status(400).json({ message: 'Invalid topics provided.' });
        }

        // Retrieve context for the selected topics
        // In a real app, we would iterate over topics and aggregate context
        const context = await retrieveContext(topics.join(' '));

        const prompt = `
      Based on the following context, generate ${quantity} multiple-choice questions.
      
      Context:
      ${context}
      
      Return the result as a JSON array of objects with the following structure:
      [
        {
          "id": "1",
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A"
        }
      ]
      
      Only return the JSON array.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const questions = JSON.parse(cleanText);

        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({ message: 'Error generating questions.' });
    }
};

export const suggestGameController = async (req: Request, res: Response) => {
    try {
        const { questions } = req.body;

        const prompt = `
      Analyze the following questions and suggest 3 suitable educational game types.
      
      Questions:
      ${JSON.stringify(questions).substring(0, 2000)}
      
      Return a JSON array of suggestions:
      [
        {
          "type": "Quiz",
          "title": "Speed Quiz",
          "description": "A fast-paced quiz game...",
          "reason": "Suitable for multiple choice..."
        }
      ]
      
      Only return the JSON array.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const suggestions = JSON.parse(cleanText);

        res.status(200).json({ suggestions });
    } catch (error) {
        console.error('Error suggesting games:', error);
        res.status(500).json({ message: 'Error suggesting games.' });
    }
};

export const generateGameCodeController = async (req: Request, res: Response) => {
    try {
        const { gameType, questions, customPrompt } = req.body;

        const prompt = `
      Create a single-file React component (using Tailwind CSS) for a "${gameType}" game.
      
      Game Data (Questions):
      ${JSON.stringify(questions)}
      
      User Custom Instructions:
      ${customPrompt || 'None'}
      
      Requirements:
      - Use 'lucide-react' for icons if needed.
      - Use 'framer-motion' for animations if needed.
      - The component should be self-contained.
      - Handle game state (start, playing, end).
      - Show score at the end.
      - Return ONLY the code string, no markdown formatting.
      - The component should be named 'GameComponent'.
      - Do not include 'import React ...' as it is already available.
      - Export the component as default.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const code = text.replace(/```tsx/g, '').replace(/```jsx/g, '').replace(/```/g, '').trim();

        res.status(200).json({ code });
    } catch (error) {
        console.error('Error generating game code:', error);
        res.status(500).json({ message: 'Error generating game code.' });
    }
};

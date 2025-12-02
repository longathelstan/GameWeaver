import { Request, Response } from 'express';
import { flashModel, proModel } from '../utils/gemini';
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

    if (!context || context.trim().length === 0) {
      console.warn('Context is empty. Skipping generation to avoid hallucinations.');
      return res.status(400).json({
        message: 'Unable to retrieve context from the uploaded file. This might be due to API rate limits or the content not matching the selected topics.'
      });
    }

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

    const result = await flashModel.generateContent(prompt);
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
      
      Constraints:
      1. At least one suggestion MUST be a 3D game (using React Three Fiber / Three.js).
      2. The other suggestions can be 2D (using Framer Motion, Canvas, or standard React).
      3. Ensure the game mechanics fit the question type (e.g., multiple choice).
      
      Questions:
      ${JSON.stringify(questions).substring(0, 2000)}
      
      Return a JSON array of suggestions:
      [
        {
          "type": "3D Runner",
          "title": "Space Runner 3D",
          "description": "Navigate a spaceship through obstacles...",
          "reason": "Engaging 3D experience for reviewing concepts..."
        }
      ]
      
      Only return the JSON array.
    `;

    const result = await flashModel.generateContent(prompt);
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
      Create a COMPLETE, SINGLE-FILE HTML5 game for a "${gameType}" game.
      
      Game Data (Questions):
      ${JSON.stringify(questions)}
      
      User Custom Instructions:
      ${customPrompt || 'None'}
      
      Requirements:
      1. Output a single valid HTML file starting with <!DOCTYPE html>.
      2. Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
      3. DO NOT USE REACT. Use Vanilla JavaScript (ES6+).
      4. Use Lucide Icons via CDN (unpkg) if needed, or SVG strings.
      5. If the game is 3D:
         - Use Three.js via CDN: <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
         - Do NOT use React Three Fiber. Use raw Three.js.
      6. Structure:
         - <head> with Tailwind script and basic styles.
         - <body> with game container.
         - <script> tag at the end of body containing all game logic.
      7. The game must be fully functional, self-contained, and handle the provided questions.
      8. Handle game states: Start Screen -> Playing -> End Screen (Score).
      9. Return ONLY the raw HTML string. Do not wrap in markdown code blocks.
    `;

    const result = await proModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const code = text.replace(/```html/g, '').replace(/```tsx/g, '').replace(/```jsx/g, '').replace(/```/g, '').trim();

    res.status(200).json({ code });
  } catch (error) {
    console.error('Error generating game code:', error);
    res.status(500).json({ message: 'Error generating game code.' });
  }
};

export const refineGameCodeController = async (req: Request, res: Response) => {
  try {
    const { currentCode, instruction } = req.body;

    if (!currentCode || !instruction) {
      return res.status(400).json({ message: 'Missing currentCode or instruction.' });
    }

    const prompt = `
      You are an expert game developer.
      
      User Request: "${instruction}"
      
      Current Game Code (HTML/JS):
      ${currentCode}
      
      Task:
      1. Modify the Current Game Code to fulfill the User Request.
      2. Ensure the code remains a SINGLE valid HTML file.
      3. Do not remove existing functionality unless asked.
      4. Return ONLY the raw HTML string. Do not wrap in markdown.
    `;

    const result = await proModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const code = text.replace(/```html/g, '').replace(/```tsx/g, '').replace(/```jsx/g, '').replace(/```/g, '').trim();

    res.status(200).json({ code });
  } catch (error) {
    console.error('Error refining game code:', error);
    res.status(500).json({ message: 'Error refining game code.' });
  }
};

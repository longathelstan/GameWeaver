import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { generateText, FLASH_MODEL, PRO_MODEL } from '../utils/gemini';
import { retrieveContext } from '../utils/ragUtils';
import { AppError } from '../middlewares/errorHandler';

// ── Schemas ──────────────────────────────────────────────────────────────────

const GenerateQuestionsSchema = z.object({
  topics: z.array(z.string().min(1)).min(1, 'At least one topic is required.'),
  quantity: z.number().int().min(1).max(20).default(5),
  bookId: z.number().int().positive('bookId is required.'),
});

const SuggestGameSchema = z.object({
  questions: z.array(z.object({}).passthrough()).min(1, 'At least one question required.'),
});

const GenerateGameCodeSchema = z.object({
  gameType: z.string().min(1, 'gameType is required.'),
  questions: z.array(z.object({}).passthrough()).min(1),
  customPrompt: z.string().optional(),
});

const RefineGameCodeSchema = z.object({
  currentCode: z.string().min(1, 'currentCode is required.'),
  instruction: z.string().min(1, 'instruction is required.'),
});

// ── Helper ────────────────────────────────────────────────────────────────────

const parseJsonFromAI = (text: string): unknown => {
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(clean);
};

// ── Controllers ───────────────────────────────────────────────────────────────

export const generateQuestionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = GenerateQuestionsSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues.map((e) => e.message).join(', '), 400);
    }
    const { topics, quantity, bookId } = parsed.data;

    const context = await retrieveContext(topics.join(' '), bookId);
    if (!context || context.trim().length === 0) {
      throw new AppError(
        'Không thể lấy nội dung từ sách đã chọn. Hãy đảm bảo sách đã được nạp dữ liệu.',
        422
      );
    }

    const prompt = `
Based on the following Vietnamese educational context, generate exactly ${quantity} multiple-choice questions in Vietnamese.

Context:
${context}

Return ONLY a valid JSON array. Each object must have:
[
  {
    "id": "1",
    "question": "Câu hỏi",
    "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
    "correctAnswer": "Lựa chọn A"
  }
]
        `.trim();

    const result = await generateText(FLASH_MODEL, prompt);
    const questions = parseJsonFromAI(result);

    res.status(200).json({ success: true, questions });
  } catch (err) {
    next(err);
  }
};

export const suggestGameController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = SuggestGameSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.issues[0].message, 400);
    const { questions } = parsed.data;

    const prompt = `
Analyze these educational questions and suggest 3 suitable HTML5 game types.

Constraints:
1. At least one suggestion MUST be a 3D game using Three.js.
2. Others can be 2D (Canvas or vanilla JS).

Questions sample:
${JSON.stringify(questions.slice(0, 3))}

Return ONLY a JSON array:
[
  {
    "type": "3D Runner",
    "title": "Space Runner 3D",
    "description": "...",
    "reason": "..."
  }
]
        `.trim();

    const result = await generateText(FLASH_MODEL, prompt);
    const suggestions = parseJsonFromAI(result);

    res.status(200).json({ success: true, suggestions });
  } catch (err) {
    next(err);
  }
};

export const generateGameCodeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = GenerateGameCodeSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.issues[0].message, 400);
    const { gameType, questions, customPrompt } = parsed.data;

    const prompt = `
Create a COMPLETE, SINGLE-FILE HTML5 educational game of type "${gameType}".

Game Data (Questions):
${JSON.stringify(questions)}

User Instructions: ${customPrompt || 'None'}

Requirements:
1. Output a single valid HTML file starting with <!DOCTYPE html>.
2. Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
3. Use Vanilla JavaScript (ES6+). NO REACT.
4. If 3D: use Three.js via CDN: <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
5. Handle game states: Start Screen → Playing → End Screen (with score).
6. Questions must be in Vietnamese.
7. Return ONLY the raw HTML. No markdown code blocks.
        `.trim();

    const result = await generateText(PRO_MODEL, prompt);
    const code = result.replace(/```html|```tsx|```jsx|```/g, '').trim();

    res.status(200).json({ success: true, code });
  } catch (err) {
    next(err);
  }
};

export const refineGameCodeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = RefineGameCodeSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.issues[0].message, 400);
    const { currentCode, instruction } = parsed.data;

    const prompt = `
You are an expert game developer.

User Request: "${instruction}"

Current Game Code (HTML/JS):
${currentCode}

Task:
1. Modify the code to fulfill the User Request.
2. Keep it a SINGLE valid HTML file.
3. Do not remove existing functionality unless asked.
4. Return ONLY the raw HTML string. No markdown.
        `.trim();

    const result = await generateText(PRO_MODEL, prompt);
    const code = result.replace(/```html|```tsx|```jsx|```/g, '').trim();

    res.status(200).json({ success: true, code });
  } catch (err) {
    next(err);
  }
};

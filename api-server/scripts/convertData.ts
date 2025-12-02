
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('GEMINI_API_KEY is missing in .env');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

const convertData = async () => {
    const inputPath = path.resolve(__dirname, '../../10t2v.json');
    const outputPath = path.resolve(__dirname, '../data/10t2v_structured.json');

    if (!fs.existsSync(inputPath)) {
        console.error(`Input file not found at ${inputPath}`);
        return;
    }

    console.log('Reading input file...');
    const rawData = fs.readFileSync(inputPath, 'utf-8');

    // We might need to chunk this if it's too huge, but 360KB should be fine for Flash/Pro.
    // Let's try sending it all.

    const prompt = `
    You are a data processing assistant. I have a JSON file representing a textbook where keys are page numbers and values are text content.
    
    Your task is to restructure this data into a JSON array of objects.
    Each object should represent a "Lesson" or a distinct section of content.
    
    The structure should be:
    [
      {
        "chapter": "Name of the Chapter (e.g., BÀI 6: NGUYỄN TRÃI...)",
        "lesson": "Name of the Lesson (e.g., Tác gia Nguyễn Trãi, Bình Ngô đại cáo...)",
        "content": "The full text content of this lesson, merged from multiple pages if necessary."
      }
    ]
    
    Rules:
    1. Identify chapters and lessons based on the text content (look for headings like "BÀI 6", "VĂN BẢN 1", etc.).
    2. Merge content from consecutive pages that belong to the same lesson.
    3. Return ONLY the JSON array. Do not include markdown formatting or explanations.
    4. Ensure the JSON is valid.
    
    Data:
    ${rawData}
    `;

    console.log('Sending data to Gemini for conversion...');
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Clean up markdown
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Validate JSON
        JSON.parse(text);

        // Ensure output dir exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, text);
        console.log(`Conversion successful! Saved to ${outputPath}`);

    } catch (error) {
        console.error('Error converting data:', JSON.stringify(error, null, 2));
        if (error instanceof Error) console.error(error.message);
        process.exit(1);
    }
};

convertData();

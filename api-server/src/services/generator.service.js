const ragService = require('./rag.service');
const geminiService = require('./gemini.service');

async function orchestratePrompt(userPrompt, gameType, outputMode) {
    // 1. Get knowledge/template from RAG
    const ragContent = await ragService.retrieve(gameType, outputMode);
    if (!ragContent) {
        throw new Error(`No RAG content found for gameType: ${gameType} and outputMode: ${outputMode}`);
    }

    // 2. Build the Master Prompt
    let masterPrompt = `User Prompt: "${userPrompt}"\n\n`;

    switch (outputMode) {
        case 'REACT_JSON':
            masterPrompt += `IMPORTANT: Generate a valid JSON array of objects based on the user prompt. The JSON must strictly adhere to the following JSON Schema. Do not include any explanations, just the raw JSON output.\n\nSchema:\n${ragContent.schema}`;
            break;
        case 'HTML':
            masterPrompt += `IMPORTANT: Based on the user prompt, complete the following HTML/CSS/JS template. You must replace the placeholder 'quizData' array with the generated content. Only output the full, complete HTML code. Do not include any explanations.\n\nTemplate:\n${ragContent.template}`;
            break;
        case 'VBA':
            masterPrompt += `IMPORTANT: Based on the user prompt, generate a complete VBA module for a PowerPoint quiz. Use the provided VBA template as a guide for structure and function names. Only output the raw VBA code. Do not include any explanations.\n\nTemplate:\n${ragContent.template}`;
            break;
        default:
            throw new Error(`Unsupported output mode: ${outputMode}`);
    }

    // 3. Call Gemini
    const generatedCode = await geminiService.generate(masterPrompt);

    // 4. Post-processing
    let finalResult = generatedCode;
    if (outputMode === 'VBA') {
        finalResult += `\n\n'-----------------------------------------------------\n' Hướng dẫn Cài đặt:\n'-----------------------------------------------------\n'${ragContent.instructions.replace(/\n/g, "\n'")}`;
    }
     if (outputMode === 'REACT_JSON') {
        try {
            // Attempt to parse to ensure it's valid JSON
            JSON.parse(finalResult);
        } catch (e) {
            console.error("Gemini did not return valid JSON.", e);
            // Optional: Add a retry mechanism or return an error
            throw new Error("Generated content is not valid JSON.");
        }
    }


    return { output: finalResult };
}

module.exports = {
    orchestratePrompt,
};

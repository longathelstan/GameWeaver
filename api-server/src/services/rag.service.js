const fs = require('fs').promises;
const path = require('path');

const KNOWLEDGE_BASE_PATH = path.join(__dirname, '..', '..', 'knowledge-base');

async function retrieve(gameType, outputMode) {
    try {
        if (outputMode === 'REACT_JSON') {
            const schemaPath = path.join(KNOWLEDGE_BASE_PATH, 'schemas', `react_${gameType.toLowerCase()}.schema.json`);
            const schema = await fs.readFile(schemaPath, 'utf-8');
            return { schema };
        }

        if (outputMode === 'HTML') {
            const templatePath = path.join(KNOWLEDGE_BASE_PATH, 'templates_code', `html_${gameType.toLowerCase()}_template.txt`);
            const template = await fs.readFile(templatePath, 'utf-8');
            return { template };
        }

        if (outputMode === 'VBA') {
            const templatePath = path.join(KNOWLEDGE_BASE_PATH, 'templates_code', `vba_${gameType.toLowerCase()}_template.txt`);
            const instructionsPath = path.join(KNOWLEDGE_BASE_PATH, 'templates_code', 'vba_instructions.txt');
            const template = await fs.readFile(templatePath, 'utf-8');
            const instructions = await fs.readFile(instructionsPath, 'utf-8');
            return { template, instructions };
        }

        return null;
    } catch (error) {
        console.error(`Error retrieving RAG content for ${gameType}/${outputMode}:`, error);
        return null;
    }
}

module.exports = {
    retrieve,
};

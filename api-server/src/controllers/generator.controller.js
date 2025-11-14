const generatorService = require('../services/generator.service');

const generateContent = async (req, res) => {
    try {
        const { prompt, gameType, outputMode } = req.body;

        if (!prompt || !gameType || !outputMode) {
            return res.status(400).json({ error: 'Missing required fields: prompt, gameType, outputMode' });
        }

        const result = await generatorService.orchestratePrompt(prompt, gameType, outputMode);
        res.json(result);

    } catch (error) {
        console.error('Error in generator controller:', error);
        res.status(500).json({ error: 'Failed to generate content.' });
    }
};

module.exports = {
    generateContent,
};

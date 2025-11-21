import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

export const generateContent = async ({ prompt, gameType, outputMode }) => {
    try {
        const response = await axios.post(`${API_URL}/generate`, {
            prompt,
            gameType,
            outputMode,
        });
        return response.data;
    } catch (error) {
        console.error("Error calling generate API:", error);
        throw error.response ? error.response.data : new Error('Network error or server is down.');
    }
};

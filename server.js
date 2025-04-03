require('dotenv').config(); // Use environment variables for API keys
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/api/images', async (req, res) => {
    const { prompt, model } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Invalid prompt' });
    }

    try {
        const response = await axios.post(
            'https://api.aimlapi.com/v1/images/generations',
            {
                prompt: prompt,
                model: model || 'dall-e-2',
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.AI_API_KEY}`, // Use environment variable for API key
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('AI/ML API response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('AI/ML API error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error generating image', details: error.response ? error.response.data : error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
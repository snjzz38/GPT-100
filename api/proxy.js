// pages/api/humanize.js or api/humanize.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { prompt, model, temperature, top_p, max_tokens } = req.body;

    if (!prompt || !model) {
        return res.status(400).json({ message: 'Missing required parameters: prompt and model.' });
    }

    const API_KEY = process.env.AI_HUMANIZER_API; // Access the securely stored API key

    if (!API_KEY) {
        console.error("AI_HUMANIZER_API environment variable is not set.");
        return res.status(500).json({ message: 'Server configuration error: API key missing.' });
    }

    try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: temperature !== undefined ? temperature : 1.0, // Default to 1.0 if not provided
                top_p: top_p !== undefined ? top_p : 0.98, // Default to 0.98 if not provided
                max_tokens: max_tokens !== undefined ? max_tokens : 2048, // Default to 2048 if not provided
            })
        });

        if (!groqResponse.ok) {
            const errorBody = await groqResponse.json();
            console.error('Error from Groq API:', groqResponse.status, errorBody);
            return res.status(groqResponse.status).json({
                message: 'Failed to get response from Groq API.',
                details: errorBody
            });
        }

        const data = await groqResponse.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Error in humanize API route:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

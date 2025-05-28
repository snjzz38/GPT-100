export default async function handler(req, res) {
  const { prompt, input, tone } = req.body;

  // You can sanitize or validate the prompt here if needed

  const apiKey = process.env.AI_Humanizer_API;

  const apiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: `${prompt}\nInput: ${input}\nTone: ${tone}` }]
    })
  });

  const data = await apiResponse.json();
  res.status(200).json({ response: data });
}

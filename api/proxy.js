// /api/key.js
export default function handler(req, res) {
  res.status(200).json({ apiKey: process.env.AI_Humanizer_API });
}

const express = require('express');
const axios = require('axios');
const OpenAI = require('openai');

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/translate', async (req, res) => {
  const { text, isEnglish } = req.body;
  
  try {
    const targetLanguage = isEnglish ? 'Turkish' : 'English';
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a translator." },
        { role: "user", content: `Translate the following text to ${targetLanguage}: "${text}"` }
      ],
      max_tokens: 150,
    });
    
    res.json({ translation: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
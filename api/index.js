const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are Meta AI inside WhatsApp, answer clearly and helpfully." },
        { role: "user", content: prompt },
      ],
    });
    res.json({ reply: completion.data.choices[0].message.content.trim() });
  } catch (e) {
    console.error("Chat error:", e);
    res.status(500).json({ reply: "⚠️ Error processing request." });
  }
});

app.post("/image", async (req, res) => {
  const { prompt } = req.body;
  try {
    const image = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
    });
    res.json({ url: image.data.data[0].url });
  } catch (e) {
    console.error("Image error:", e);
    res.status(500).json({ url: "" });
  }
});

module.exports = app;
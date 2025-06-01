const axios = require("axios");
require("dotenv").config(); // Load environment variables

   const OPENROUTER_API_KEY = "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";

async function getRecommendation(prompt, model = "openai/gpt-3.5-turbo") {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",  // <-- ✅ Comma fixed here
      {
        model: model,
        messages: [
          { role: "system", content: "You are a helpful travel advisor." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const message = response.data.choices?.[0]?.message?.content;
    return message || "No recommendation received.";
  } catch (err) {
    console.error("OpenRouter API error:", err.response?.data || err.message);
    throw new Error("Failed to fetch recommendation");
  }
}

module.exports = { getRecommendation };

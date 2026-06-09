export const askAI = async (prompt) => {

  // LOCAL DEVELOPMENT MODE
  if (process.env.AI_MODE === "mock") {

    return `[MOCK AI RESPONSE]
You asked: ${prompt}

Stemify is Thinking.....`;
  }

  // -------- PRODUCTION MODE (OLLAMA) --------

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek",
        prompt: prompt,
        stream: false
      })
    });

    const data = await res.json();
    return data.response;

  } catch (err) {

    return "AI service currently unavailable.";
  }
};

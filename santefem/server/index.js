const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8787;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/ai/message", async (req, res) => {
  if (!anthropicApiKey) {
    return res.status(500).json({
      error: "Server misconfigured: ANTHROPIC_API_KEY is missing."
    });
  }

  const { model, max_tokens, system, messages } = req.body || {};
  if (!model || !max_tokens || !Array.isArray(messages)) {
    return res.status(400).json({
      error: "Invalid payload. Expected model, max_tokens and messages."
    });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system: system || "",
        messages
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json(data);
    }
    return res.json(data);
  } catch (_error) {
    return res.status(502).json({
      error: "Upstream AI provider request failed."
    });
  }
});

app.listen(port, () => {
  console.log(`AI proxy listening on http://localhost:${port}`);
});

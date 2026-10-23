const express = require("express");

const app = express();
app.use(express.json({ limit: "100kb" }));

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "Spidey Meta Backend"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/track", (req, res) => {
  const { event, page, timestamp } = req.body || {};

  if (typeof event !== "string" || event.length > 80) {
    return res.status(400).json({
      ok: false,
      error: "Invalid event"
    });
  }

  console.log("Event received:", JSON.stringify({
    event,
    page: typeof page === "string" ? page.slice(0, 300) : "",
    timestamp: typeof timestamp === "string" ? timestamp : ""
  }));

  res.status(202).json({
    ok: true,
    received: true,
    note: "Database and analytics are not configured yet."
  });
});

app.post("/api/telegram/webhook", async (req, res) => {
  if (!BOT_TOKEN) {
    return res.status(503).json({
      ok: false,
      error: "Bot token is not configured"
    });
  }

  if (
    WEBHOOK_SECRET &&
    req.get("x-telegram-bot-api-secret-token") !== WEBHOOK_SECRET
  ) {
    return res.status(401).json({ ok: false });
  }

  res.sendStatus(200);

  try {
    const message = req.body?.message;
    const chatId = message?.chat?.id;
    const text = message?.text;

    if (!chatId || typeof text !== "string" ||
        !text.startsWith("/start")) {
      return;
    }

    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Welcome! Spidey Meta Bot backend is running."
        })
      }
    );
  } catch (error) {
    console.error("Telegram error:", error.message);
  }
});

app.listen(PORT, () => {
  console.log("Spidey backend running on port " + PORT);
});

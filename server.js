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
    received: true
  });
});

app.post("/api/telegram/webhook", async (req, res) => {
  if (!BOT_TOKEN || !WEBHOOK_SECRET) {
    return res.sendStatus(503);
  }

  if (
    req.get("x-telegram-bot-api-secret-token") !== WEBHOOK_SECRET
  ) {
    return res.sendStatus(401);
  }

  res.sendStatus(200);

  try {
    const message = req.body?.message;
    const chatId = message?.chat?.id;
    const messageText = message?.text;

    if (
      !chatId ||
      typeof messageText !== "string" ||
      !messageText.startsWith("/start")
    ) {
      return;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Welcome! Spidey Meta Bot is running."
        })
      }
    );

    if (!response.ok) {
      console.error("Telegram sendMessage failed:", response.status);
    }
  } catch (error) {
    console.error("Telegram error:", error.message);
  }
});

app.listen(PORT, () => {
  console.log("Spidey backend running on port " + PORT);
});

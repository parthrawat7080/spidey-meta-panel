app.get("/setup-telegram-webhook", async (req, res) => {
  const setupKey = process.env.WEBHOOK_SETUP_KEY;

  if (!setupKey || req.query.key !== setupKey) {
    return res.status(403).json({ ok: false });
  }

  if (!BOT_TOKEN || !WEBHOOK_SECRET) {
    return res.status(500).json({
      ok: false,
      error: "Telegram environment variables missing"
    });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: "https://spidey-meta-panel.onrender.com/api/telegram/webhook",
          secret_token: WEBHOOK_SECRET
        })
      }
    );

    const result = await response.json();
    res.json({ ok: result.ok, description: result.description });
  } catch {
    res.status(500).json({ ok: false, error: "Webhook setup failed" });
  }
});

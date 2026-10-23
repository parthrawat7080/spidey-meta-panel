# Spidey Meta Backend

## Render configuration

Runtime: Node

Build Command:
npm install

Start Command:
npm start

Branch:
main

Root Directory:
Leave blank

## Environment Variables

TELEGRAM_BOT_TOKEN
TELEGRAM_WEBHOOK_SECRET

Set these securely in Render.
Never put secret tokens in frontend HTML or GitHub.

## Current limitations

This starter provides a health endpoint, a basic
event receiver, and a Telegram /start webhook handler.

It does not yet store analytics in a database,
calculate real visitor counts, or connect Meta
Conversions API.

The Telegram webhook must be configured separately.

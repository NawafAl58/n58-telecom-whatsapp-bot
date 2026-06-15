# N58 Telecom WhatsApp Bot
### Made by Nawaf

A production-ready WhatsApp bot for SIM affiliate businesses. Built with Node.js and the WhatsApp Cloud API.

## Features
- Step-by-step user guidance (Duration, Data, SIM Type).
- Automated recommendations (stc, Mobily, Airalo).
- Dynamic affiliate link delivery.
- Clean environment variable configuration.

## Deployment Instructions

### 1. WhatsApp Setup
- Go to [Meta for Developers](https://developers.facebook.com/).
- Create a Business App and set up WhatsApp.
- Get your **Temporary/Permanent Token**, **Phone Number ID**, and set a **Verify Token**.

### 2. Deploy to Railway/Render
- Fork or push this repo to your GitHub.
- Connect the repo to [Railway.app](https://railway.app) or [Render.com](https://render.com).
- Add the following Environment Variables:
  - `PORT`: 3000
  - `WHATSAPP_TOKEN`: Your Meta access token.
  - `PHONE_NUMBER_ID`: Your WhatsApp Phone Number ID.
  - `VERIFY_TOKEN`: A secret string you choose for webhook verification.

### 3. Webhook Configuration
- Once deployed, your URL will be `https://your-app-name.railway.app/webhook`.
- Enter this URL in the Meta Developer portal under WhatsApp > Configuration.
- Use the same `VERIFY_TOKEN` you set in your env variables.
- Subscribe to `messages` in Webhook fields.

## Branding
This bot is part of the N58 Telecom ecosystem.
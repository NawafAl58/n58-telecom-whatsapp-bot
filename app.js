const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Simulated session store
const sessions = {};

// Affiliate Links
const AFFILIATE_LINKS = {
    stc: "https://stc.com.sa/n58-affiliate",
    mobily: "https://mobily.com.sa/n58-affiliate",
    airalo: "https://airalo.com/n58-affiliate"
};

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});

app.post('/webhook', async (req, res) => {
    const body = req.body;
    if (body.object === 'whatsapp_business_account') {
        const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        if (message) {
            const from = message.from;
            const text = message.text?.body?.toLowerCase();

            if (!sessions[from]) {
                sessions[from] = { step: 1 };
                await sendMessage(from, "Welcome to N58 Telecom! Made by Nawaf.\\n\\nLet's find the best SIM for you. How many days is your stay?");
            } else if (sessions[from].step === 1) {
                sessions[from].duration = text;
                sessions[from].step = 2;
                await sendMessage(from, "Great! How much data do you need? (e.g., 5GB, 10GB, Unlimited)");
            } else if (sessions[from].step === 2) {
                sessions[from].data = text;
                sessions[from].step = 3;
                await sendMessage(from, "Do you prefer an eSIM or a Physical SIM?");
            } else if (sessions[from].step === 3) {
                sessions[from].type = text;
                const recommendation = getRecommendation(sessions[from]);
                const link = AFFILIATE_LINKS[recommendation.id];
                await sendMessage(from, `Based on your needs, we recommend: ${recommendation.name}!\\n\\nGet it here: ${link}\\n\\nThank you for choosing N58 Telecom.`);
                delete sessions[from];
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

function getRecommendation(session) {
    if (session.type.includes('esim')) return { id: 'airalo', name: 'Airalo (eSIM Specialist)' };
    if (session.duration > 15) return { id: 'stc', name: 'stc (Best for Long Stays)' };
    return { id: 'mobily', name: 'Mobily (Best for Short Stays)' };
}

async function sendMessage(to, text) {
    try {
        await axios.post(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
            messaging_product: "whatsapp",
            to: to,
            text: { body: text }
        }, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}` }
        });
    } catch (err) {
        console.error("Error sending message", err.response?.data || err.message);
    }
}

app.listen(PORT, () => console.log(`N58 Bot listening on port ${PORT}`));
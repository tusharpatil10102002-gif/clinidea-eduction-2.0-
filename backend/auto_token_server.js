const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.get('/login', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ]
  });
  res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('<h1>No authorization code provided.</h1>');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
    
    if (envContent.includes('YOUTUBE_REFRESH_TOKEN=')) {
      envContent = envContent.replace(/YOUTUBE_REFRESH_TOKEN=.*/g, `YOUTUBE_REFRESH_TOKEN="${tokens.refresh_token}"`);
    } else {
      envContent += `\nYOUTUBE_REFRESH_TOKEN="${tokens.refresh_token}"\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    
    res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 80px; padding: 40px; background: #f0fdf4; border-radius: 16px; max-width: 600px; margin-left: auto; margin-right: auto; border: 1px solid #bbf7d0;">
        <h1 style="color: #16a34a; font-size: 2.2rem; margin-bottom: 12px;">YouTube Connected Successfully! 🎉</h1>
        <p style="font-size: 1.1rem; color: #15803d; line-height: 1.6;">Your YouTube Channel (@ClinideaEducation-i7q) Refresh Token has been automatically saved to your .env file.</p>
        <p style="font-size: 1rem; color: #475569; margin-top: 24px;">All mentor uploaded videos will now automatically post to your YouTube Channel in <strong>Private Mode</strong>.</p>
        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">You can close this tab now.</p>
      </div>
    `);
    
    console.log("✅ YOUTUBE REFRESH TOKEN SAVED AUTOMATICALLY TO .ENV!");
    
    setTimeout(() => {
      process.exit(0);
    }, 2000);

  } catch (err) {
    console.error('Error getting tokens:', err);
    res.status(500).send('<h1>Error getting tokens</h1><p>' + err.message + '</p>');
  }
});

app.listen(PORT, () => {
  console.log(`\n--- 🎥 YOUTUBE 1-CLICK AUTH SERVER READY ---`);
  console.log(`Click this link to authorize @ClinideaEducation-i7q: http://localhost:${PORT}/login\n`);
});

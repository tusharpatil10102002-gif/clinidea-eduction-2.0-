const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

async function generateRefreshToken() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = 'https://developers.google.com/oauthplayground';

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ]
  });

  console.log('\n======================================================');
  console.log('🎥 YOUTUBE DATA API 1-CLICK AUTH URL GENERATOR');
  console.log('======================================================\n');
  console.log('Step 1: Open this exact link in your browser:\n');
  console.log(authUrl);
  console.log('\nStep 2: Log in with @ClinideaEducation-i7q Google Account & click "Allow".');
  console.log('Step 3: Copy the Code parameter shown on screen or URL.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Paste the Authorization Code here: ', async (code) => {
    try {
      const { tokens } = await oauth2Client.getToken(code.trim());
      
      const envPath = path.join(__dirname, '.env');
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
      
      if (envContent.includes('YOUTUBE_REFRESH_TOKEN=')) {
        envContent = envContent.replace(/YOUTUBE_REFRESH_TOKEN=.*/g, `YOUTUBE_REFRESH_TOKEN="${tokens.refresh_token}"`);
      } else {
        envContent += `\nYOUTUBE_REFRESH_TOKEN="${tokens.refresh_token}"\n`;
      }
      
      fs.writeFileSync(envPath, envContent);

      console.log('\n✅ SUCCESS! Refresh Token has been automatically saved to backend/.env file!');
      console.log(`Token: ${tokens.refresh_token}`);
      console.log('You can now upload videos directly from Mentor Dashboard to YouTube in Private Mode!\n');
    } catch (err) {
      console.error('\n❌ Error exchanging code for token:', err.message);
    } finally {
      rl.close();
    }
  });
}

generateRefreshToken();

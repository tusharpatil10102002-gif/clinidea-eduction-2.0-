const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

/**
 * Uploads a video file directly to the configured YouTube Channel (@ClinideaEducation-i7q)
 * @param {string} filePath Path to local video file
 * @param {string} title Title of video
 * @param {string} description Description of video
 * @param {string} privacyStatus 'unlisted' | 'private' | 'public'
 * @returns {Promise<{videoId: string, videoUrl: string, embedUrl: string}>}
 */
async function uploadToYouTubeChannel(filePath, title, description = '', privacyStatus = 'unlisted') {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('YOUTUBE_API_CREDENTIALS_MISSING');
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    process.env.YOUTUBE_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  const response = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: title || 'Clinidea Lecture Session',
        description: description || 'Clinidea Education Official Lecture Video',
        categoryId: '27' // Education category
      },
      status: {
        privacyStatus: privacyStatus || 'unlisted',
        selfDeclaredMadeForKids: false
      }
    },
    media: {
      body: fs.createReadStream(filePath)
    }
  });

  const videoId = response.data.id;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return { videoId, videoUrl, embedUrl };
}

module.exports = {
  uploadToYouTubeChannel
};

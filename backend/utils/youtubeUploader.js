const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

/**
 * Uploads a video file directly to the configured YouTube Channel (@ClinideaEducation-i7q)
 * and automatically attaches it to a batch-specific Playlist.
 * 
 * @param {string} filePath Path to local video file
 * @param {string} title Title of video
 * @param {string} description Description of video
 * @param {string} privacyStatus 'unlisted' | 'private' | 'public'
 * @param {string} playlistTitle Batch name to create/find playlist for (e.g., 'August 2026')
 * @returns {Promise<{videoId: string, videoUrl: string, embedUrl: string, playlistId: string|null}>}
 */
async function uploadToYouTubeChannel(filePath, title, description = '', privacyStatus = 'unlisted', playlistTitle = null) {
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

  // 1. Upload Video
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
  let playlistId = null;

  // 2. Attach Video to Batch Playlist if playlistTitle provided
  if (playlistTitle && playlistTitle.trim()) {
    try {
      const cleanPlaylistName = playlistTitle.trim();
      
      // Search for existing playlist
      const existingPlaylists = await youtube.playlists.list({
        part: 'snippet',
        mine: true,
        maxResults: 50
      });

      const matchedPlaylist = existingPlaylists.data.items?.find(
        pl => pl.snippet?.title?.toLowerCase() === cleanPlaylistName.toLowerCase()
      );

      if (matchedPlaylist) {
        playlistId = matchedPlaylist.id;
      } else {
        // Create new Playlist for the Batch
        const newPlaylist = await youtube.playlists.insert({
          part: 'snippet,status',
          requestBody: {
            snippet: {
              title: cleanPlaylistName,
              description: `Recorded Lecture Playlist for Batch: ${cleanPlaylistName} - Clinidea Education`
            },
            status: {
              privacyStatus: 'unlisted' // Unlisted playlist for batch privacy
            }
          }
        });
        playlistId = newPlaylist.data.id;
        console.log(`✅ Created new YouTube Playlist for Batch [${cleanPlaylistName}]:`, playlistId);
      }

      // Add Video to Playlist
      if (playlistId) {
        await youtube.playlistItems.insert({
          part: 'snippet',
          requestBody: {
            snippet: {
              playlistId: playlistId,
              resourceId: {
                kind: 'youtube#video',
                videoId: videoId
              }
            }
          }
        });
        console.log(`✅ Video [${videoId}] added to Playlist [${playlistId}]`);
      }
    } catch (plErr) {
      console.warn('Playlist management notice:', plErr.message);
    }
  }

  return { videoId, videoUrl, embedUrl, playlistId };
}

module.exports = {
  uploadToYouTubeChannel
};

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { uploadToYouTubeChannel } = require('./utils/youtubeUploader');

async function testUpload() {
  console.log('--- TESTING YOUTUBE API UPLOAD ---');
  console.log('CLIENT_ID:', process.env.YOUTUBE_CLIENT_ID ? 'OK' : 'MISSING');
  console.log('CLIENT_SECRET:', process.env.YOUTUBE_CLIENT_SECRET ? 'OK' : 'MISSING');
  console.log('REFRESH_TOKEN:', process.env.YOUTUBE_REFRESH_TOKEN ? 'OK' : 'MISSING');

  // Find any test mp4 file in uploads/lms_materials
  const lmsDir = path.join(__dirname, 'uploads', 'lms_materials');
  if (!fs.existsSync(lmsDir)) {
    console.error('lms_materials directory not found');
    return;
  }

  const files = fs.readdirSync(lmsDir).filter(f => f.endsWith('.mp4'));
  if (files.length === 0) {
    console.log('No mp4 file found in uploads/lms_materials');
    return;
  }

  const testFile = path.join(lmsDir, files[0]);
  console.log('Testing with file:', testFile);

  try {
    const res = await uploadToYouTubeChannel(testFile, 'Test Lecture Video', 'Test upload from backend', 'unlisted');
    console.log('✅ UPLOAD SUCCESSFUL!');
    console.log('Result:', res);
  } catch (err) {
    console.error('❌ UPLOAD ERROR:', err);
  }
}

testUpload();

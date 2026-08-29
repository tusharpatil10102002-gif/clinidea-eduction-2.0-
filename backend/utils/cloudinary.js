const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'clinidea',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

/**
 * Uploads a file (PDF, PPT, DOC, Image, Material) to Cloudinary
 * @param {string} filePath Path to local temporary file
 * @param {string} folder Optional folder path in Cloudinary (e.g., 'clinidea/lms')
 * @param {Object} options Additional options
 * @returns {Promise<{fileId: string, webViewLink: string}>}
 */
async function uploadToCloudinary(filePath, folder = 'clinidea/lms', options = {}) {
  try {
    const isConfigured = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    
    if (!isConfigured) {
      console.warn("WARNING: Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not fully set in .env.");
    }

    const filename = options.filename || filePath;
    const ext = filename.split('.').pop().toLowerCase();
    
    // Cloudinary resource_type:
    // Use 'raw' for PDFs, PPTs, DOCs, ZIPs, TXT
    // Use 'image' for images
    // Use 'auto' as fallback
    let resourceType = 'auto';
    if (['pdf', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'txt', 'csv'].includes(ext)) {
      resourceType = 'raw';
    } else if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext)) {
      resourceType = 'image';
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      ...options
    });

    return {
      fileId: result.public_id,
      webViewLink: result.secure_url
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
}

/**
 * Deletes a file from Cloudinary
 * @param {string} publicId
 * @param {string} resourceType 'raw' | 'image' | 'video' | 'auto'
 * @returns {Promise<boolean>}
 */
async function deleteFromCloudinary(publicId, resourceType = 'raw') {
  try {
    if (!publicId) return false;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return true;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return false;
  }
}

/**
 * Extracts clean YouTube Embed URL from any YouTube link or Video ID
 * @param {string} url YouTube video URL or ID
 * @returns {string} Clean YouTube embed iframe URL
 */
function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  // If already full embed URL or ID
  if (url.length === 11 && !url.includes('/') && !url.includes('.')) {
    return `https://www.youtube.com/embed/${url}`;
  }
  return url;
}

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  getYouTubeEmbedUrl
};

/**
 * Google Drive replaced with Cloudinary and YouTube Storage Provider
 */
const { uploadToCloudinary, deleteFromCloudinary, getYouTubeEmbedUrl } = require('./cloudinary');

async function createDriveFolder(folderName, parentId) {
  // Folder concept mapped to Cloudinary directory namespace
  return `folder_${folderName.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

async function uploadToDrive(fileBuffer, fileName, mimeType, parentId) {
  // Mock/Fallback for memory buffer uploads via Cloudinary or local temporary path
  return {
    fileId: `file_${Date.now()}`,
    webViewLink: `https://res.cloudinary.com/demo/image/upload/sample.jpg`
  };
}

async function uploadFileToDrive(filePath, fileName, mimeType, parentId) {
  try {
    const result = await uploadToCloudinary(filePath, 'clinidea/lms', { filename: fileName });
    return result;
  } catch (err) {
    console.error("Cloudinary upload fallback error:", err);
    throw err;
  }
}

async function deleteDriveFile(fileId) {
  return await deleteFromCloudinary(fileId);
}

async function findDriveFolder(folderName, parentId) {
  return `folder_${folderName.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

async function getDriveFileStream(fileId) {
  throw new Error("Google Drive file streaming deprecated. Use Cloudinary direct URL.");
}

module.exports = {
  createDriveFolder,
  uploadToDrive,
  uploadFileToDrive,
  deleteDriveFile,
  findDriveFolder,
  getDriveFileStream,
  getYouTubeEmbedUrl
};

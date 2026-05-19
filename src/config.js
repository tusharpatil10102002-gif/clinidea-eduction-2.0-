// Dynamically resolve backend URL. If running on localhost, use localhost:5000. 
// If running on a local network IP (e.g. 192.168.x.x), use that IP to allow mobile testing.
const currentHostname = window.location.hostname;
const currentProtocol = window.location.protocol; // 'http:' or 'https:'

export const BASE_URL = import.meta.env.VITE_API_URL || 
  (currentHostname === 'localhost' 
    ? 'http://localhost:5000' 
    : `${currentProtocol}//${currentHostname}${currentProtocol === 'https:' ? '' : ':5000'}`);

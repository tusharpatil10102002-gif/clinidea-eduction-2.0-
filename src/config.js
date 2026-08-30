// Dynamically resolve backend URL.
const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const currentProtocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';

export const BASE_URL = import.meta.env.VITE_API_URL || 
  (currentHostname === 'localhost' || currentHostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : (currentHostname.startsWith('192.168.') || currentHostname.startsWith('10.') || currentHostname.startsWith('172.'))
    ? `${currentProtocol}//${currentHostname}:5000`
    : `${currentProtocol}//${currentHostname}${currentProtocol === 'https:' ? '' : ':5000'}`);

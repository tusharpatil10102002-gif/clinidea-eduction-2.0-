import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ContentPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlLink = params.get('link');
    const urlTitle = params.get('title');
    const urlType = params.get('type');

    if (!urlLink) {
      // Invalid access, go back to dashboard
      navigate('/dashboard');
      return;
    }

    setLink(urlLink.replace('/view', '/preview'));
    setTitle(urlTitle || 'Clinidea Recorded Session');
    setType(urlType || 'video');
  }, [location, navigate]);

  const handleClose = () => {
    try {
      window.close();
    } catch (err) {
      console.error("Failed to close window directly:", err);
    }
    // Mobile browsers and standard tabs block window.close() unless opened via window.open.
    // We fall back instantly to navigating back to /dashboard to prevent students getting stuck.
    setTimeout(() => {
      navigate('/dashboard');
    }, 150);
  };

  if (!link) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100dvh', backgroundColor: '#000', overflow: 'hidden', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
      
      {/* Mobile-Friendly Premium Top Bar */}
      <div style={{ padding: '14px 20px', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <h5 style={{ color: '#fff', margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '600', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '80%' }}>
          <i className="fa fa-video text-info" style={{ color: '#06B6D4' }}></i> {title}
        </h5>
        <button 
          onClick={handleClose} 
          className="btn d-flex justify-content-center align-items-center" 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            border: '1px solid rgba(255, 255, 255, 0.15)', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            color: '#fff',
            transition: 'all 0.2s ease'
          }}
          title="Back to Dashboard"
        >
          <i className="fa fa-times"></i>
        </button>
      </div>

      {/* Video Container (Properly Responsive Aspect & Frame) */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <iframe 
          src={link} 
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          allow="autoplay; fullscreen"
          allowFullScreen
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          title={title}
        ></iframe>

        {/* Mask over the Google Drive Popout Button */}
        <div 
          style={{ 
            position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', 
            backgroundColor: 'transparent', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
          title="Clinidea Protected Content"
        >
           {/* Transparent mask to block clicks but not look ugly */}
           <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}></div>
           <i className="fa fa-shield-alt position-relative" style={{ fontSize: '1.2rem', color: '#06B6D4', opacity: 0.6 }}></i>
        </div>
      </div>
    </div>
  );
};

export default ContentPlayer;

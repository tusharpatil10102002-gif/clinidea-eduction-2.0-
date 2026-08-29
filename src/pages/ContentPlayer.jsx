import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (url.length === 11 && !url.includes('/') && !url.includes('.')) {
    return `https://www.youtube.com/embed/${url}?autoplay=1&rel=0&modestbranding=1`;
  }
  return url;
}

const ContentPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlLink = params.get('link');
    const urlTitle = params.get('title');
    const urlType = params.get('type');

    if (!urlLink) {
      navigate('/dashboard');
      return;
    }

    const formattedLink = getYouTubeEmbedUrl(urlLink);
    setLink(formattedLink);
    setTitle(urlTitle || 'Clinidea Video Session');
    setType(urlType || 'video');

    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location, navigate]);

  const handleClose = () => {
    try {
      window.close();
    } catch (err) {
      console.error("Failed to close window directly:", err);
    }
    setTimeout(() => {
      navigate('/dashboard');
    }, 150);
  };

  if (!link) return null;

  const isDirectVideo = link.endsWith('.mp4') || link.endsWith('.webm') || link.endsWith('.ogg') || link.includes('/uploads/');
  const isYouTube = link.includes('youtube.com') || link.includes('youtu.be');

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: `${windowHeight}px`, backgroundColor: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Bar */}
      <div style={{ padding: '12px 20px', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h5 style={{ color: '#fff', margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '80%' }}>
          <i className="fab fa-youtube" style={{ color: '#FF0000', fontSize: '1.2rem' }}></i> {title}
        </h5>
        <button 
          onClick={handleClose} 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '8px', 
            border: '1px solid rgba(255, 255, 255, 0.2)', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            color: '#fff',
            cursor: 'pointer'
          }}
          title="Back to Dashboard"
        >
          ✕
        </button>
      </div>

      {/* Full Screen Video / Iframe Container */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isDirectVideo ? (
          <video 
            src={link.startsWith('http') || link.startsWith('/') ? link : `/${link}`} 
            controls 
            autoPlay 
            style={{ width: '100%', height: '100%', outline: 'none' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe 
            src={link} 
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            title={title}
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default ContentPlayer;

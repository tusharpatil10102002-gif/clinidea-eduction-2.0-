import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  }
  if (url.length === 11 && !url.includes('/') && !url.includes('.')) {
    return `https://www.youtube-nocookie.com/embed/${url}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  }
  return url;
}

const ContentPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [hasError, setHasError] = useState(false);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    // 1. Strict Authentication Guard
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    const mentorToken = localStorage.getItem('mentorToken');
    if (!userToken && !adminToken && !mentorToken) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true });
      return;
    }

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

    // 2. Hide Raw Link from browser address bar to prevent copying/sharing
    try {
      window.history.replaceState({}, '', '/watch');
    } catch (e) {
      // ignore
    }

    // 3. Block keyboard shortcuts that expose video source
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
      ) {
        e.preventDefault();
        return false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
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
  const isYouTube = link.includes('youtube.com') || link.includes('youtu.be') || link.includes('youtube-nocookie.com');

  let resolvedVideoSrc = link;
  if (isDirectVideo) {
    if (link.startsWith('http://localhost:5000') || link.startsWith('http://127.0.0.1:5000')) {
      resolvedVideoSrc = link;
    } else if (link.startsWith('http://') || link.startsWith('https://')) {
      resolvedVideoSrc = link;
    } else if (link.startsWith('/uploads/')) {
      resolvedVideoSrc = `${BASE_URL}${link}`;
    } else if (link.startsWith('uploads/')) {
      resolvedVideoSrc = `${BASE_URL}/${link}`;
    } else {
      resolvedVideoSrc = `${BASE_URL}/${link}`;
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: `${windowHeight}px`, backgroundColor: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Bar */}
      <div style={{ padding: '12px 20px', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h5 style={{ color: '#fff', margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '80%' }}>
          <span>{title}</span>
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
      <div 
        onContextMenu={(e) => e.preventDefault()}
        style={{ flex: 1, position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', userSelect: 'none' }}
      >
        {hasError ? (
          <div className="text-center p-4 text-white" style={{ maxWidth: '500px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h4 className="fw-bold mb-2 text-white">Video Unavailable</h4>
            <p className="text-muted small mb-4">
              This video session cannot be streamed directly. If it was recently uploaded, it may still be processing on YouTube or the file may need to be re-uploaded.
            </p>
            <button onClick={handleClose} className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
              Back to Dashboard
            </button>
          </div>
        ) : isDirectVideo ? (
          <video 
            src={resolvedVideoSrc} 
            controls 
            autoPlay 
            controlsList="nodownload"
            onError={() => setHasError(true)}
            style={{ width: '100%', height: '100%', outline: 'none', objectFit: 'contain' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Top Transparent Shield: Blocks clicking on YouTube title & share button */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '54px', zIndex: 10, background: 'transparent' }} />
            
            {/* Bottom-Right Shield: Blocks clicking on YouTube watermark logo */}
            <div style={{ position: 'absolute', bottom: '12px', right: '48px', width: '60px', height: '36px', zIndex: 10, background: 'transparent' }} />

            {/* Anti-Piracy Watermark */}
            <div style={{ position: 'absolute', bottom: '18px', left: '18px', zIndex: 10, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', pointerEvents: 'none', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
              Clinidea LMS Protected Session
            </div>

            <iframe 
              src={link} 
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={title}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPlayer;

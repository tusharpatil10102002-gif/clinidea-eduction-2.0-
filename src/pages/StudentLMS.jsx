import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  return url;
}

function StudentLMS() {
  const [contents, setContents] = useState([]);
  const [enrolledBatches, setEnrolledBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [userContext, setUserContext] = useState({ fullName: '' });
  const navigate = useNavigate();

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch profile to get student's real full name
      try {
        const profileUrl = `${BASE_URL}/api/student/profile`;
        const pRes = await fetch(profileUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.profile && pData.profile.user) {
            setUserContext(pData.profile.user);
          }
        }
      } catch (err) {
        console.error("Failed to fetch student profile", err);
      }

      const res = await fetch(`${BASE_URL}/api/student/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.contents)) {
          setContents(data.contents);
          setEnrolledBatches(data.enrolledBatches || []);
        } else if (Array.isArray(data)) {
          setContents(data);
        }
      } else {
        console.error("Failed to fetch LMS content");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Group content by Module Name -> Category
  const groupedContent = contents.reduce((acc, curr) => {
    const mod = curr.moduleName || 'General';
    if (!acc[mod]) acc[mod] = {};
    
    let cat = curr.category;
    if (cat === 'PPTs') cat = 'Presentations'; // handle any old data
    if (!cat) {
      if (curr.contentType === 'video') cat = 'Recorded Sessions';
      else if (curr.contentType === 'ppt') cat = 'Presentations';
      else cat = 'Additional Study Material';
    }
    
    if (!acc[mod][cat]) acc[mod][cat] = [];
    
    acc[mod][cat].push(curr);
    return acc;
  }, {});

  const getIcon = (type) => {
    switch(type) {
      case 'video': return 'fa-video text-danger';
      case 'pdf': return 'fa-file-pdf text-danger';
      case 'ppt': return 'fa-file-powerpoint text-warning';
      default: return 'fa-file-alt text-primary';
    }
  };

  const getCategoryIcon = (category) => {
    if (category === 'Recorded Sessions') return 'fa-play-circle text-danger';
    if (category === 'Presentations') return 'fa-desktop text-warning';
    return 'fa-book text-primary';
  };

  const Thumbnail = ({ item, active }) => {
    const [imgError, setImgError] = React.useState(false);
    if (imgError || !item.driveFileId) {
      return (
        <div className={`d-flex justify-content-center align-items-center rounded ${active ? 'bg-light bg-opacity-25' : 'bg-light'}`} style={{ width: '60px', height: '45px', flexShrink: 0 }}>
          <i className={`fa ${getIcon(item.contentType)} ${active ? 'text-white' : ''}`}></i>
        </div>
      );
    }
    return (
      <img loading="lazy" src={`https://drive.google.com/thumbnail?id=${item.driveFileId}&sz=w200`} 
        onError={() => setImgError(true)}
        className="rounded shadow-sm" 
        style={{ width: '60px', height: '45px', objectFit: 'cover', flexShrink: 0, border: active ? '2px solid white' : '1px solid var(--color-border)' }} 
        alt="thumb" 
      />
    );
  };

  return (
    <div className="portal-root d-flex flex-column min-vh-100">
      {/* 1. LMS Cinema Topbar */}
      <header className="portal-topbar">
        <div className="d-flex align-items-center gap-3">
          <Link to="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="bg-white rounded-3 p-1 d-flex align-items-center justify-content-center border shadow-xs" style={{ width: '40px', height: '40px' }}>
              <img 
                src="/clinidea Logo/Clinidea_Education_Logo_header.webp" 
                alt="Clinidea" 
                className="img-fluid" 
                style={{ maxHeight: '100%', objectFit: 'contain' }} 
                onError={(e) => { e.target.src = '/assets/images/logo.png'; }} 
              />
            </div>
            <div className="d-none d-sm-block">
              <span className="fw-bold text-dark fs-5" style={{ letterSpacing: '-0.3px' }}>Clinidea</span>
              <span className="portal-brand-badge ms-2" style={{ background: '#eef2ff', color: '#4f46e5' }}>Cinema LMS</span>
            </div>
          </Link>

          {enrolledBatches.length > 0 && (
            <span className="badge rounded-pill bg-light text-dark border px-3 py-2 d-none d-lg-inline-flex align-items-center gap-2 shadow-xs ms-2">
              <i className="fa fa-layer-group text-primary"></i>
              <span className="fw-bold">{enrolledBatches[0].name}</span>
            </span>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          {enrolledBatches.map(batch => (
            <a 
              key={batch.id} 
              href={`https://jitsi.belnet.be/Clinidea_LiveClass_Batch_${batch.id}_General#userInfo.displayName="${encodeURIComponent(userContext.fullName || 'Student')}"&config.prejoinPageEnabled=false`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-danger btn-sm rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm text-decoration-none" 
            >
              <i className="fa fa-video"></i>
              <span className="d-none d-md-inline">Join Live Classroom</span>
            </a>
          ))}

          <Link to="/dashboard" className="btn btn-light btn-sm rounded-pill px-3 py-2 border fw-bold text-dark d-flex align-items-center gap-2 shadow-xs">
            <i className="fa fa-arrow-left"></i>
            <span className="d-none d-sm-inline">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* 2. Workspace Body */}
      <main className="flex-grow-1 p-3 p-md-4 p-xl-5 portal-scrollbar" style={{ backgroundColor: '#f8fafc' }}>
        <div className="mx-auto" style={{ maxWidth: '1600px' }}>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
          ) : contents.length === 0 ? (
            <div className="portal-card text-center py-5">
              <div className="card-body py-5">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center p-4 mb-3" style={{ width: '90px', height: '90px' }}>
                  <i className="fa fa-folder-open text-muted fs-1 opacity-50"></i>
                </div>
                <h3 className="fw-bold text-dark mb-2">No Content Available</h3>
                <p className="text-muted fs-5 mb-0 mx-auto" style={{ maxWidth: '500px' }}>
                  You are either not enrolled in any batches, or your mentors haven't uploaded any content yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              
              {/* Content Viewer / Cinema Player */}
              <div className={`col-lg-8 ${!activeVideo ? 'd-none d-lg-block' : ''}`}>
                {activeVideo ? (
                  <div className="d-flex flex-column gap-3">
                    
                    {/* Cinema Grade Player Frame */}
                    <div className="portal-player-frame">
                      {/* DRM Watermark Overlay */}
                      <div className="portal-watermark-overlay">
                        <i className="fa fa-shield-alt text-primary me-1"></i>
                        Clinidea Protected Stream • {userContext.fullName || 'Student'}
                      </div>

                      <div 
                        id="content-viewer-container" 
                        className="position-relative w-100" 
                        style={{ 
                          width: '100%',
                          height: activeVideo.contentType === 'video' ? 'auto' : '72vh', 
                          aspectRatio: activeVideo.contentType === 'video' ? '16/9' : 'auto', 
                          backgroundColor: '#000', 
                          overflow: 'hidden'
                        }}
                      >
                        {activeVideo.driveWebViewLink ? (
                          (() => {
                            const link = activeVideo.driveWebViewLink;
                            const isYouTube = link.includes('youtube.com') || link.includes('youtu.be');
                            const isDirectVideo = link.endsWith('.mp4') || link.endsWith('.webm') || link.endsWith('.ogg') || link.includes('/uploads/');
                            
                            if (activeVideo.contentType === 'video' || isYouTube) {
                              if (isYouTube) {
                                const ytEmbed = getYouTubeEmbedUrl(link);
                                return (
                                  <iframe 
                                    src={ytEmbed} 
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                                    allowFullScreen
                                    style={{ border: 'none', backgroundColor: '#000' }}
                                    title={activeVideo.title}
                                  ></iframe>
                                );
                              }
                              return isDirectVideo ? (
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
                                  width="100%" 
                                  height="100%" 
                                  frameBorder="0"
                                  allow="autoplay; fullscreen"
                                  allowFullScreen
                                  style={{ border: 'none', backgroundColor: '#000' }}
                                  title={activeVideo.title}
                                ></iframe>
                              );
                            } else {
                              const isPdf = link.toLowerCase().includes('.pdf') || activeVideo.contentType === 'pdf';
                              return (
                                <div className="w-100 h-100 d-flex flex-column" style={{ backgroundColor: '#0f172a' }}>
                                  <iframe 
                                    src={isPdf ? `https://docs.google.com/viewer?url=${encodeURIComponent(link)}&embedded=true` : link} 
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0"
                                    allowFullScreen
                                    style={{ border: 'none', flex: 1 }}
                                    title={activeVideo.title}
                                  ></iframe>
                                  <div className="p-3 bg-dark text-white d-flex justify-content-between align-items-center">
                                    <span className="small text-white-50"><i className="fas fa-file-alt me-2"></i>{activeVideo.title}</span>
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm rounded-pill px-3 fw-bold">
                                      <i className="fas fa-download me-1"></i> Open / Download File
                                    </a>
                                  </div>
                                </div>
                              );
                            }
                          })()
                        ) : (
                          <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white-50 p-5">
                            <i className="fa fa-exclamation-circle mb-2" style={{ fontSize: '2.5rem' }}></i>
                            <p className="fs-5">Content link unavailable</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Active Content Meta Card */}
                    <div className="portal-card p-4">
                      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-1 fw-bold">
                              <i className={`fa ${getCategoryIcon(activeVideo.category || 'Recorded Sessions')} me-1`}></i>
                              {activeVideo.category || 'Lecture'}
                            </span>
                            <span className="badge rounded-pill bg-light text-muted border px-3 py-1">
                              {activeVideo.moduleName || 'General Topic'}
                            </span>
                          </div>
                          <h3 className="fw-bold text-dark mb-2" style={{ fontSize: '1.4rem' }}>{activeVideo.title}</h3>
                          <p className="text-muted mb-0" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                            {activeVideo.description || 'No specific description provided for this session.'}
                          </p>
                        </div>

                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-light rounded-pill border px-3 py-2 fw-semibold d-none d-md-flex align-items-center gap-2 shadow-xs"
                            title="Fullscreen Mode"
                            onClick={() => {
                              const elem = document.getElementById('content-viewer-container');
                              if (elem) {
                                if (elem.requestFullscreen) elem.requestFullscreen();
                                else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
                                else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
                              }
                            }}
                          >
                            <i className="fa fa-expand"></i> Fullscreen
                          </button>
                          <button 
                            className="btn btn-danger bg-opacity-10 text-danger border-0 rounded-pill px-3 py-2 fw-bold d-lg-none"
                            onClick={() => {
                              setActiveVideo(null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <i className="fa fa-times me-1"></i> Close
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="portal-card p-5 text-center d-flex flex-column justify-content-center align-items-center h-100" style={{ minHeight: '65vh' }}>
                    <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center mb-4" style={{ width: '100px', height: '100px' }}>
                      <i className="fa fa-play-circle fs-1"></i>
                    </div>
                    <h3 className="fw-bold text-dark mb-2">Select Content to View</h3>
                    <p className="text-muted fs-5 mb-0 mx-auto" style={{ maxWidth: '420px' }}>
                      Choose a module and lecture from the curriculum sidebar to start watching or reading.
                    </p>
                  </div>
                )}
              </div>

              {/* Module Curriculum Sidebar */}
              <div className="col-lg-4">
                <div className="portal-card overflow-hidden d-flex flex-column" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                  
                  <div className="p-4 border-bottom bg-white sticky-top" style={{ zIndex: 10 }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2">
                          <i className="fa fa-list-ul"></i>
                        </div>
                        <h5 className="fw-bold mb-0 text-dark">Course Curriculum</h5>
                      </div>
                      <span className="badge rounded-pill bg-light text-dark border px-3 py-1 fw-bold">
                        {contents.length} Items
                      </span>
                    </div>
                  </div>

                  <div className="p-0 overflow-auto portal-scrollbar">
                    <div className="accordion accordion-flush" id="moduleAccordion">
                      {Object.keys(groupedContent).map((moduleName, index) => (
                        <div className="accordion-item border-bottom" key={`mod-${index}`}>
                          <h2 className="accordion-header">
                            <button 
                              className={`accordion-button ${index !== 0 ? 'collapsed' : ''} bg-white px-4 py-3`} 
                              type="button" 
                              data-bs-toggle="collapse" 
                              data-bs-target={`#collapse${index}`} 
                              style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.98rem', boxShadow: 'none' }}
                            >
                              <span className="d-flex align-items-center gap-2">
                                <i className="fa fa-folder text-warning fs-5"></i> {moduleName}
                              </span>
                            </button>
                          </h2>
                          <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#moduleAccordion">
                            <div className="accordion-body p-0" style={{ backgroundColor: '#f8fafc' }}>
                              
                              {['Recorded Sessions', 'Presentations', 'Additional Study Material'].map((category, catIndex) => {
                                const items = groupedContent[moduleName][category];
                                if (!items || items.length === 0) return null;

                                return (
                                  <div className="mb-0" key={`cat-${index}-${catIndex}`}>
                                    <div className="px-4 py-2 bg-light border-top border-bottom text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                      <i className={`fa ${getCategoryIcon(category)} me-2`}></i> {category}
                                    </div>
                                    <div className="list-group list-group-flush">
                                      {items.map(item => {
                                        const isActive = activeVideo?.id === item.id;
                                        return (
                                          <button 
                                            key={item.id} 
                                            className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-3 transition-all ${isActive ? 'bg-primary bg-opacity-10' : ''}`}
                                            onClick={() => {
                                              setActiveVideo(item);
                                              if (window.innerWidth < 992) {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                              }
                                            }}
                                            style={{ 
                                              borderLeft: isActive ? '4px solid #4f46e5 !important' : '4px solid transparent !important',
                                              backgroundColor: isActive ? '#eef2ff' : 'transparent'
                                            }}
                                          >
                                            <Thumbnail item={item} active={isActive} />
                                            <div className="text-start flex-grow-1 min-w-0">
                                              <span className={`d-block text-truncate fw-semibold mb-1 ${isActive ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '0.9rem' }}>
                                                {item.title}
                                              </span>
                                              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.72rem' }}>
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary border rounded-pill px-2 py-0">
                                                  {item.contentType.toUpperCase()}
                                                </span>
                                                {isActive && (
                                                  <span className="text-primary fw-bold">
                                                    <i className="fa fa-play-circle me-1"></i> Now Playing
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}

                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
              
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default StudentLMS;

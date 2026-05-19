import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../config';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Data States
  const [userContext, setUserContext] = useState({ fullName: '', email: '', phone: '' });
  const [profile, setProfile] = useState({
    dateOfBirth: '', gender: '', address: '', city: '', state: '', pincode: '',
    qualification: '', collegeName: '', graduationYear: ''
  });
  
  const [documents, setDocuments] = useState([]);
  const [scheduleData, setScheduleData] = useState({ classes: [], courseName: null, batchName: null });
  const [certificates, setCertificates] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // Live Sessions & Notifications
  const [liveSessions, setLiveSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // LMS Content
  const [contents, setContents] = useState([]);
  const [enrolledBatches, setEnrolledBatches] = useState([]);

  // File Upload State
  const [uploadType, setUploadType] = useState('photo');
  const [selectedFile, setSelectedFile] = useState(null);

  // UI State
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [activeTab, setActiveTab] = useState('lms'); // 'lms', 'live', 'vault'
  const [activeLMSCategory, setActiveLMSCategory] = useState('Recorded Sessions');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchDashboardData = React.useCallback(async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // 1. Fetch Profile
      const profileUrl = `${BASE_URL}/api/student/profile`;
      const pRes = await fetch(profileUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      const pData = await pRes.json();
      
      if (pRes.ok && pData.profile) {
        if(pData.profile.user) setUserContext(pData.profile.user);
        const mappedProfile = { ...pData.profile };
        if (mappedProfile.dateOfBirth) mappedProfile.dateOfBirth = mappedProfile.dateOfBirth.split('T')[0];
        setProfile(mappedProfile);
      }

      // 2. Fetch Docs
      const docUrl = `${BASE_URL}/api/student/documents`;
      const dRes = await fetch(docUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      const dData = await dRes.json();
      if (dRes.ok) setDocuments(dData.documents || []);
      
      // 3. Fetch Schedule
      const schedUrl = `${BASE_URL}/api/student/classes`;
      const sRes = await fetch(schedUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (sRes.ok) setScheduleData(await sRes.json());

      // 4. Fetch Certificates
      const certUrl = `${BASE_URL}/api/student/certificates`;
      const cRes = await fetch(certUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (cRes.ok) setCertificates((await cRes.json()).certificates || []);
      
      // 5. Fetch Payments
      const paymentUrl = `${BASE_URL}/api/student/payments`;
      const payRes = await fetch(paymentUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (payRes.ok) setPayments((await payRes.json()).payments || []);

      // 6. Fetch LMS Content
      const lmsRes = await fetch(`${BASE_URL}/api/student/content`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (lmsRes.ok) {
        const lmsData = await lmsRes.json();
        if (lmsData && Array.isArray(lmsData.contents)) {
          setContents(lmsData.contents);
          setEnrolledBatches(lmsData.enrolledBatches || []);
        } else if (Array.isArray(lmsData)) {
          setContents(lmsData);
        }
      }

      // 7. Fetch Live Sessions
      const liveRes = await fetch(`${BASE_URL}/api/student/live-sessions`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (liveRes.ok) setLiveSessions(await liveRes.json());

      setLoading(false);
    } catch (_err) {
      localStorage.removeItem('userToken');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Notifications Polling
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/api/student/notifications`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setNotifications(await res.json());
      } catch (e) {}
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const handleMarkNotificationsRead = async () => {
    const token = localStorage.getItem('userToken');
    try {
      await fetch(`${BASE_URL}/api/student/notifications/read`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
      setNotifications([]);
      setShowNotifications(false);
    } catch (e) {}
  };

  const handleProfileChange = (e) => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('userToken');
    
    try {
      const res = await fetch(`${BASE_URL}/api/student/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMessage({ text: 'Profile successfully updated.', type: 'success' });
      } else {
         const data = await res.json();
         setMessage({ text: data.error || 'Failed to save profile.', type: 'danger' });
      }
    } catch (_err) {
      setMessage({ text: 'Network connection dropped.', type: 'danger' });
    }
    setSaving(false);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ text: 'Please select a file to upload.', type: 'warning' });
      return;
    }
    setUploading(true);
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('document_type', uploadType);
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${BASE_URL}/api/student/upload-document`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Document securely vaulted.', type: 'success' });
        setSelectedFile(null);
        fetchDashboardData();
      } else {
        setMessage({ text: data.error || 'Upload rejected by security validation.', type: 'danger' });
      }
    } catch (_err) {
      setMessage({ text: 'Upload failed.', type: 'danger' });
    }
    setUploading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const categorizedContent = {
    'Recorded Sessions': [],
    'Presentations': [],
    'Additional Study Material': []
  };

  contents.forEach(curr => {
    let cat = curr.category;
    if (!cat || !categorizedContent[cat]) {
      // Fallback for old content uploaded before this change
      if (curr.contentType === 'video') cat = 'Recorded Sessions';
      else if (curr.contentType === 'ppt') cat = 'Presentations';
      else cat = 'Additional Study Material';
    }
    if (categorizedContent[cat]) {
      categorizedContent[cat].push(curr);
    }
  });

  const getCategoryIcon = (category) => {
    if (category === 'Recorded Sessions') return 'fa-play-circle text-danger';
    if (category === 'Presentations') return 'fa-file-powerpoint text-warning';
    return 'fa-book text-info';
  };

  const getIcon = (type) => {
    switch(type) {
      case 'video': return 'fa-video text-danger';
      case 'pdf': return 'fa-file-pdf text-danger';
      case 'ppt': return 'fa-file-powerpoint text-warning';
      default: return 'fa-file-alt text-info';
    }
  };



  const calculateProgress = () => {
    let completed = 0;
    const total = 11;
    if (profile.dateOfBirth) completed++;
    if (profile.gender) completed++;
    if (profile.address) completed++;
    if (profile.city) completed++;
    if (profile.state) completed++;
    if (profile.pincode) completed++;
    if (profile.qualification) completed++;
    if (profile.collegeName) completed++;
    if (profile.graduationYear) completed++;
    if (documents.some(d => d.documentType === 'photo')) completed++;
    if (documents.some(d => d.documentType === 'id_proof')) completed++;
    return Math.round((completed / total) * 100);
  };

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;

  const completionPercentage = calculateProgress();
  const currentItems = categorizedContent[activeLMSCategory] || [];

  return (
    <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)', marginTop: '60px', backgroundColor: 'var(--color-bg-light)', color: 'var(--color-text-dark)', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="d-md-none position-fixed w-100 h-100" 
          style={{ top: '60px', left: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1030 }}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <div 
        className={`bg-white shadow-sm d-flex flex-column transition-all student-sidebar ${isSidebarOpen ? 'open' : ''}`}
      >
        <div className="p-4 d-flex justify-content-between align-items-center d-md-none border-bottom">
           <h5 className="heading-premium mb-0 text-primary">Menu</h5>
           <button className="btn text-muted p-0" onClick={() => setIsSidebarOpen(false)}><i className="fa fa-times fs-4"></i></button>
        </div>
        
        <div className="p-3 flex-grow-1 overflow-auto">
          <p className="text-muted small fw-bold text-uppercase px-3 mb-2 mt-2" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>Navigation</p>
          <div className="list-group list-group-flush gap-2">
            <button onClick={() => { setActiveTab('lms'); setIsSidebarOpen(false); }} className={`list-group-item list-group-item-action border-0 rounded-3 px-4 py-3 d-flex align-items-center ${activeTab === 'lms' ? 'bg-theme-secondary text-white fw-bold shadow-sm' : 'text-dark hover-bg-light'}`} style={{ transition: 'all 0.2s' }}>
              <i className="fa fa-laptop-code me-3 fs-5" style={{ width: '24px', textAlign: 'center' }}></i> Course Content
            </button>
            <button onClick={() => { setActiveTab('live'); setIsSidebarOpen(false); }} className={`list-group-item list-group-item-action border-0 rounded-3 px-4 py-3 d-flex align-items-center ${activeTab === 'live' ? 'bg-theme-secondary text-white fw-bold shadow-sm' : 'text-dark hover-bg-light'}`} style={{ transition: 'all 0.2s' }}>
              <i className="fa fa-video me-3 fs-5" style={{ width: '24px', textAlign: 'center' }}></i> Live Sessions
            </button>
            <button onClick={() => { setActiveTab('vault'); setIsSidebarOpen(false); }} className={`list-group-item list-group-item-action border-0 rounded-3 px-4 py-3 d-flex align-items-center ${activeTab === 'vault' ? 'bg-theme-secondary text-white fw-bold shadow-sm' : 'text-dark hover-bg-light'}`} style={{ transition: 'all 0.2s' }}>
              <i className="fa fa-certificate me-3 fs-5" style={{ width: '24px', textAlign: 'center' }}></i> Certificates
            </button>
          </div>

          <p className="text-muted small fw-bold text-uppercase px-3 mb-2 mt-4" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>Account</p>
          <div className="list-group list-group-flush gap-2">
            <button onClick={() => { setShowProfilePanel(true); setIsSidebarOpen(false); }} className="list-group-item list-group-item-action border rounded-3 px-4 py-3 d-flex align-items-center text-dark hover-bg-light shadow-sm" style={{ transition: 'all 0.2s' }}>
              <i className="fa fa-user-edit me-3 fs-5 text-theme-secondary" style={{ width: '24px', textAlign: 'center' }}></i> Profile Settings
            </button>
            <button onClick={handleLogout} className="list-group-item list-group-item-action border rounded-3 px-4 py-3 d-flex align-items-center text-dark hover-bg-light shadow-sm mt-2" style={{ transition: 'all 0.2s' }}>
              <i className="fa fa-sign-out-alt me-3 fs-5 text-danger" style={{ width: '24px', textAlign: 'center' }}></i> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div 
        className="flex-grow-1 d-flex flex-column w-100 sidebar-margin-responsive"
        style={{ transition: 'margin-left 0.3s ease-in-out', minWidth: 0 }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .student-sidebar {
            width: 260px;
            position: fixed;
            top: 60px;
            bottom: 0;
            left: 0;
            z-index: 1040;
            border-right: 1px solid var(--color-border);
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
            background-color: #ffffff;
          }
          .student-sidebar.open {
            transform: translateX(0) !important;
          }
          @media (min-width: 768px) {
            .student-sidebar {
              transform: translateX(0) !important;
            }
            .sidebar-margin-responsive {
              margin-left: 260px !important;
            }
          }
          .hover-bg-light:hover { background-color: #f8fafc !important; }
        `}} />
        
        {/* Topbar */}
        <div className="shadow-sm px-4 py-3 d-flex justify-content-between align-items-center bg-white position-sticky" style={{ top: '60px', zIndex: 1000, borderBottom: '1px solid var(--color-border)' }}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light d-md-none p-2 border rounded" onClick={() => setIsSidebarOpen(true)}>
              <i className="fa fa-bars fs-5 text-dark"></i>
            </button>
            <div>
              <h4 className="heading-premium mb-0 d-none d-sm-block text-dark" style={{ fontSize: '1.25rem' }}>Welcome back, {userContext.fullName || 'Student'}!</h4>
              <h5 className="heading-premium mb-0 d-sm-none text-dark">Dashboard</h5>
              <p className="text-muted small mb-0 d-none d-md-block">Track your progress and access your learning materials.</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Notification Bell */}
            <div className="position-relative">
              <button className="btn btn-light rounded-circle shadow-sm position-relative" style={{ width: '40px', height: '40px' }} onClick={() => setShowNotifications(!showNotifications)}>
                <i className="fa fa-bell text-muted"></i>
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="card-premium position-absolute mt-2 p-0 shadow-lg" style={{ width: '300px', zIndex: 1050, maxHeight: '400px', overflowY: 'auto', right: '-10px' }}>
                  <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center p-3">
                    <h6 className="mb-0 fw-bold">Notifications</h6>
                    {notifications.length > 0 && (
                      <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={handleMarkNotificationsRead}>Mark all read</button>
                    )}
                  </div>
                  <div className="list-group list-group-flush">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted small">No new notifications.</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="list-group-item p-3 border-0 border-bottom bg-light">
                          <div className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{n.title}</div>
                          <div className="text-muted small">{n.message}</div>
                          <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>{new Date(n.createdAt).toLocaleTimeString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* User Avatar Placeholder */}
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center border border-primary d-none d-sm-flex" style={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={() => setShowProfilePanel(true)} title="Profile Settings">
               <span className="text-primary fw-bold">{userContext.fullName ? userContext.fullName.charAt(0).toUpperCase() : 'S'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="p-3 p-md-4 flex-grow-1 w-100 mx-auto" style={{ maxWidth: '1400px' }}>

        {/* Tab Content: LMS */}
        {activeTab === 'lms' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card-premium p-4 min-vh-50">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                  <h4 className="heading-premium text-dark mb-0"><i className="fa fa-folder-open text-primary me-2"></i> Course Content</h4>
                  
                  {/* Category Selector on Mobile (Premium Dropdown Menu) */}
                  <div className="d-md-none w-100 mt-1">
                    <div className="position-relative">
                      <select 
                        value={activeLMSCategory} 
                        onChange={(e) => setActiveLMSCategory(e.target.value)}
                        className="w-100 px-3 py-2 fw-semibold text-dark"
                        style={{ 
                          paddingRight: '40px', 
                          fontSize: '0.85rem', 
                          borderRadius: '10px', 
                          border: '1.5px solid var(--color-border)', 
                          height: '42px',
                          cursor: 'pointer',
                          backgroundColor: '#f8fafc',
                          appearance: 'none',
                          WebkitAppearance: 'none'
                        }}
                      >
                        {Object.keys(categorizedContent).map((category, idx) => (
                          <option key={idx} value={category}>
                            📂 {category} ({categorizedContent[category].length})
                          </option>
                        ))}
                      </select>
                      <div className="position-absolute" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <i className="fa fa-chevron-down text-muted" style={{ fontSize: '0.8rem' }}></i>
                      </div>
                    </div>
                  </div>

                  {/* Category Pills on Desktop */}
                  <div className="d-none d-md-flex gap-2" style={{ overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' }}>
                    {Object.keys(categorizedContent).map((category, idx) => (
                      <button
                        key={idx}
                        className={`btn rounded-pill px-3 py-1 fw-semibold border shadow-sm ${activeLMSCategory === category ? 'bg-theme-secondary text-white border-0' : 'bg-white text-muted hover-bg-light'}`}
                        onClick={() => setActiveLMSCategory(category)}
                        style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', transition: 'all 0.2s' }}
                      >
                        {category} ({categorizedContent[category].length})
                      </button>
                    ))}
                  </div>
                </div>
                
                {currentItems.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center mb-4 mx-auto" style={{ width: '80px', height: '80px' }}>
                      <i className={`fa ${getCategoryIcon(activeLMSCategory)} fs-2 text-muted`}></i>
                    </div>
                    <h5 className="heading-premium text-muted">No content available in this category yet.</h5>
                  </div>
                ) : (
                  <div className="row g-3">
                    {currentItems.map(item => (
                      <div key={item.id} className="col-md-6 col-lg-4 col-xl-3">
                        <div 
                          className="card-premium h-100" 
                          style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                          onClick={() => {
                            if (item.driveWebViewLink) {
                              const url = `/watch?link=${encodeURIComponent(item.driveWebViewLink)}&title=${encodeURIComponent(item.title)}&type=${item.contentType}`;
                              window.open(url, '_blank');
                            }
                          }}
                          onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.classList.add('shadow'); }}
                          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.classList.remove('shadow'); }}
                          title="Click to open in new tab"
                        >
                          {/* LMS Video Thumbnail Area */}
                          <div 
                            className="position-relative w-100 border-bottom" 
                            style={{ 
                              aspectRatio: '16/9', 
                              background: item.contentType === 'video' ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Hover overlay for Play button animation */}
                            <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.1)', transition: 'background-color 0.3s' }}>
                              <div className="rounded-circle d-flex justify-content-center align-items-center play-btn-overlay" style={{ width: '54px', height: '54px', backgroundColor: item.contentType === 'video' ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.15)', backdropFilter: 'blur(5px)', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                                <i className={`fa ${item.contentType === 'video' ? 'fa-play' : 'fa-file-alt'} fs-4`} style={{ color: item.contentType === 'video' ? '#fff' : '#0f172a', marginLeft: item.contentType === 'video' ? '4px' : '0' }}></i>
                              </div>
                            </div>

                            {/* Module Name / Topic Badge at Top Left */}
                            <div className="position-absolute" style={{ top: '12px', left: '12px', zIndex: 5 }}>
                              <span className="badge rounded-pill" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.7rem', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600', letterSpacing: '0.5px' }}>
                                {item.moduleName || 'General Topic'}
                              </span>
                            </div>
                            
                            {/* Duration / Type indicator at Bottom Right */}
                            <div className="position-absolute" style={{ bottom: '8px', right: '8px', zIndex: 5 }}>
                              <span className="badge rounded bg-dark text-white opacity-75" style={{ fontSize: '0.65rem', padding: '4px 6px' }}>
                                {item.contentType === 'video' ? '1080p' : 'Doc'}
                              </span>
                            </div>
                          </div>

                          {/* Content Details Area */}
                          <div className="card-body p-3 d-flex flex-column bg-white h-100">
                            <h6 className="heading-premium text-dark mb-1 fw-bold" style={{ fontSize: '0.95rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {item.title}
                            </h6>
                            <p className="text-muted small mb-0 mt-1" style={{ fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {item.description ? item.description : (item.contentType === 'video' ? 'Recorded Video Lecture' : 'Downloadable Study Material')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Live Sessions */}
        {activeTab === 'live' && (
          <div className="row">
            <div className="col-12">
              <div className="card-premium">
                <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                  <h4 className="heading-premium text-dark mb-0">Upcoming & Live Sessions</h4>
                  <p className="text-muted small mb-0 mt-1">Join your interactive classes via Clinidea Space.</p>
                </div>
                <div className="card-body p-4 bg-light">
                  {liveSessions.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="bg-white rounded-circle d-flex justify-content-center align-items-center mb-4 mx-auto shadow-sm" style={{ width: '80px', height: '80px' }}>
                        <i className="fa fa-calendar-times text-muted fs-2"></i>
                      </div>
                      <h5 className="heading-premium text-muted">No Live Sessions Found</h5>
                      <p className="text-muted small">You currently have no scheduled live classes.</p>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {liveSessions.map(cls => (
                        <div key={cls.id} className="col-md-6 col-lg-4">
                          <div className="card-premium h-100 overflow-hidden" style={{ transition: 'transform 0.2s', border: cls.status === 'live' ? '2px solid #ef4444' : 'none' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
                            <div className="p-3" style={{ background: cls.status === 'live' ? '#ef4444' : 'var(--color-primary)' }}>
                              <h6 className="heading-premium mb-0 text-white d-flex justify-content-between align-items-center">
                                <span><i className="fa fa-video me-2"></i> {cls.title || 'Live Class'}</span>
                                {cls.status === 'live' && <span className="badge bg-white text-danger heartbeat rounded-pill" style={{ fontSize: '0.65rem' }}>LIVE NOW</span>}
                              </h6>
                            </div>
                            <div className="card-body p-4">
                              <div className="d-flex align-items-center mb-3">
                                <div className="bg-light rounded p-2 me-3"><i className="fa fa-calendar-day text-primary fs-5"></i></div>
                                <div>
                                  <small className="text-muted d-block lh-1">Date</small>
                                  <span className="fw-bold text-dark">{new Date(cls.sessionDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mb-4">
                                <div className="bg-light rounded p-2 me-3"><i className="fa fa-clock text-primary fs-5"></i></div>
                                <div>
                                  <small className="text-muted d-block lh-1">Time</small>
                                  <span className="fw-bold text-dark">{cls.sessionTime}</span>
                                </div>
                              </div>
                              <a 
                                href={`https://jitsi.belnet.be/Clinidea_LiveClass_Batch_${cls.batchId}_${cls.id}#userInfo.displayName="${encodeURIComponent(userContext.fullName || 'Student')}"&config.prejoinPageEnabled=false`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-premium w-100 text-center text-decoration-none d-block fw-bold shadow-sm" 
                                style={{ backgroundColor: cls.status === 'live' ? '#ef4444' : '#4f46e5', color: 'white', transition: 'all 0.2s' }}
                              >
                                {cls.status === 'live' ? 'Join Live Class' : 'Enter Meeting Space'} <i className="fa fa-external-link-alt ms-2"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Vault */}
        {activeTab === 'vault' && (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card-premium h-100">
                <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                  <h4 className="heading-premium text-dark mb-0"><i className="fa fa-certificate text-warning me-2"></i> My Certificates</h4>
                </div>
                <div className="card-body p-4 bg-light">
                  {certificates.length === 0 ? <p className="text-muted text-center py-4">No certificates issued yet.</p> : (
                    <div className="d-flex flex-column gap-3">
                      {certificates.map(cert => (
                        <div key={cert.id} className="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-white shadow-sm">
                          <div>
                            <h6 className="heading-premium mb-1 text-dark">{cert.course?.name || "Course"}</h6>
                            <span className="badge mb-1" style={{ background: '#fffbeb', color: '#f59e0b', border: '1px solid #fcd34d' }}>{cert.certificateType}</span>
                            <div className="small text-muted">ID: {cert.certificateId}</div>
                          </div>
                          <a href={`${BASE_URL}${cert.fileUrl}`} target="_blank" rel="noreferrer" className="btn-premium px-4 py-2 fw-bold shadow-sm" style={{ backgroundColor: '#4f46e5', color: 'white', fontSize: '0.85rem', transition: 'all 0.2s' }}>Download</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card-premium h-100">
                <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                  <h4 className="heading-premium text-dark mb-0"><i className="fa fa-file-invoice-dollar text-success me-2"></i> Payment Receipts</h4>
                </div>
                <div className="card-body p-4 bg-light">
                  {payments.length === 0 ? <p className="text-muted text-center py-4">No payment history.</p> : (
                    <div className="d-flex flex-column gap-3">
                      {payments.map(pay => (
                        <div key={pay.id} className="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-white shadow-sm">
                          <div>
                            <h6 className="heading-premium text-dark mb-1">₹{pay.amount} <span className="text-muted fw-normal" style={{ fontSize: '0.9rem' }}>({pay.courseName})</span></h6>
                            <div className="small text-muted">{new Date(pay.paymentDate).toLocaleDateString()} • {pay.paymentStatus}</div>
                          </div>
                          {pay.fileUrl && <a href={`${BASE_URL}${pay.fileUrl}`} target="_blank" rel="noreferrer" className="btn-premium px-4 py-2 fw-bold shadow-sm" style={{ backgroundColor: '#4f46e5', color: 'white', fontSize: '0.85rem', transition: 'all 0.2s' }}>Receipt</a>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* End Main Content Wrapper */}
      </div>

      {/* Slide-Over Profile Panel */}
      {showProfilePanel && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowProfilePanel(false)}></div>
          <div className="bg-white shadow-lg overflow-auto" style={{ position: 'fixed', top: 0, right: 0, width: '450px', maxWidth: '100%', height: '100vh', zIndex: 1050, transition: 'transform 0.3s', borderLeft: '1px solid var(--color-border)' }}>
            <div className="p-4 d-flex justify-content-between align-items-center position-sticky top-0 bg-white" style={{ zIndex: 10, borderBottom: '1px solid var(--color-border)' }}>
              <h4 className="heading-premium mb-0 text-dark">Profile & Settings</h4>
              <button onClick={() => setShowProfilePanel(false)} className="btn text-muted"><i className="fa fa-times fs-4"></i></button>
            </div>
            
            <div className="p-4 bg-light min-vh-100">
              {message.text && <div className={`alert alert-${message.type} small fw-bold shadow-sm`}>{message.text}</div>}
              
              <div className="card-premium p-4 mb-4">
                <h6 className="heading-premium mb-3 text-primary"><i className="fa fa-cloud-upload-alt me-2"></i> Document Vault</h6>
                <form onSubmit={handleFileUpload} className="p-3 rounded-3 bg-light border">
                  <select className="input-premium bg-white mb-3" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                    <option value="photo">Passport Photo</option>
                    <option value="id_proof">Government ID / Aadhar</option>
                    <option value="education_certificate">Degree / Transcript</option>
                  </select>
                  <input type="file" className="input-premium bg-white mb-3" style={{ padding: '8px' }} onChange={(e) => setSelectedFile(e.target.files[0])} />
                  <button type="submit" disabled={uploading} className="btn w-100 py-2 text-white fw-bold shadow-sm bg-theme-secondary border-0" style={{ transition: 'all 0.2s' }}>
                    {uploading ? 'Uploading...' : 'Secure Upload'}
                  </button>
                </form>
                
                {documents.length > 0 && (
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {documents.map(doc => (
                      <span key={doc.id} className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-sm"><i className="fa fa-lock me-1 text-success"></i> {doc.documentType.replace('_', ' ')}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="card-premium p-4 mb-4">
                <h6 className="heading-premium mb-3 text-primary"><i className="fa fa-user-edit me-2"></i> Demographics</h6>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Date of Birth</label>
                    <input type="date" className="input-premium bg-light" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleProfileChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Gender</label>
                    <select className="input-premium bg-light" name="gender" value={profile.gender} onChange={handleProfileChange}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Address</label>
                    <input type="text" className="input-premium bg-light" name="address" value={profile.address} onChange={handleProfileChange} />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-12 col-sm-4">
                      <label className="form-label small fw-bold text-muted">City</label>
                      <input type="text" className="input-premium bg-light" name="city" value={profile.city} onChange={handleProfileChange} />
                    </div>
                    <div className="col-12 col-sm-4">
                      <label className="form-label small fw-bold text-muted">State</label>
                      <input type="text" className="input-premium bg-light" name="state" value={profile.state} onChange={handleProfileChange} />
                    </div>
                    <div className="col-12 col-sm-4">
                      <label className="form-label small fw-bold text-muted">Pin</label>
                      <input type="text" className="input-premium bg-light" name="pincode" value={profile.pincode} onChange={handleProfileChange} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Qualification</label>
                    <input type="text" className="input-premium bg-light" name="qualification" value={profile.qualification} onChange={handleProfileChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">College</label>
                    <input type="text" className="input-premium bg-light" name="collegeName" value={profile.collegeName} onChange={handleProfileChange} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Grad Year</label>
                    <input type="text" className="input-premium bg-light" name="graduationYear" value={profile.graduationYear} onChange={handleProfileChange} />
                  </div>
                  
                  <button type="submit" disabled={saving} className="btn w-100 py-3 text-white fw-bold shadow-sm bg-theme-secondary border-0" style={{ transition: 'all 0.2s' }}>
                    {saving ? 'Saving...' : 'Save Profile Details'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default StudentDashboard;

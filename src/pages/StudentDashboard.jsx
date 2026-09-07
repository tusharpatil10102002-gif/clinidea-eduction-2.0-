import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../config';
import StudentAssignments from '../components/student/StudentAssignments';
import StudentExams from '../components/student/StudentExams';
import StudentPayments from '../components/student/StudentPayments';
import StudentAITutor from '../components/student/StudentAITutor';

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
  const [pendingEnrollments, setPendingEnrollments] = useState([]);

  // File Upload State
  const [uploadType, setUploadType] = useState('photo');
  const [selectedFile, setSelectedFile] = useState(null);

  // Advanced Academic Data
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [pendingAbsence, setPendingAbsence] = useState(null);
  const [absenceReasonText, setAbsenceReasonText] = useState('');

  // Fee Blocking State
  const [isFeeBlocked, setIsFeeBlocked] = useState(false);
  const [feeBlockMessage, setFeeBlockMessage] = useState('');

  // UI State
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'lms', 'live', 'vault'
  const [activeLMSCategory, setActiveLMSCategory] = useState('Recordings');
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

      // 5.5 Fetch Pending Enrollments
      const pendingUrl = `${BASE_URL}/api/student/pending-enrollments`;
      const pendRes = await fetch(pendingUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (pendRes.ok) setPendingEnrollments((await pendRes.json()).enrollments || []);

      // 6. Fetch LMS Content
      const lmsRes = await fetch(`${BASE_URL}/api/student/content`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (lmsRes.status === 403) {
        const lmsError = await lmsRes.json();
        if (lmsError.isFeeBlock) {
          setIsFeeBlocked(true);
          setFeeBlockMessage(lmsError.error);
        }
      }
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

      // 8. Fetch Pending Absences
      const absRes = await fetch(`${BASE_URL}/api/student/pending-absences`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (absRes.ok) {
        const absData = await absRes.json();
        if (absData.absences && absData.absences.length > 0) {
          setPendingAbsence(absData.absences[0]); // Show popup for the first pending absence
        }
      }

      // 9. Fetch Assignments
      const assignRes = await fetch(`${BASE_URL}/api/student/assignments`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (assignRes.ok) setAssignments((await assignRes.json()).assignments || []);

      // 10. Fetch Exams
      const examsRes = await fetch(`${BASE_URL}/api/student/exams`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (examsRes.ok) setExams((await examsRes.json()).exams || []);

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

  const handlePayPending = async (enrollment) => {
    try {
      const token = localStorage.getItem('userToken');
      const orderRes = await fetch(`${BASE_URL}/api/student/pay-pending-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ enrollmentId: enrollment.id })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const options = {
        key: 'dummy_key', // This is handled in backend but required by Razorpay frontend script in some versions, or it uses the global script
        amount: orderData.amount,
        currency: "INR",
        name: "Clinidea Education",
        description: `Pending Fee Payment - ${enrollment.courseName}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${BASE_URL}/api/student/verify-pending-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                enrollmentId: enrollment.id
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);
            alert("Payment Successful!");
            fetchDashboardData();
          } catch (err) {
            alert(err.message);
          }
        },
        prefill: {
          name: userContext.fullName,
          email: userContext.email,
          contact: userContext.phone
        },
        theme: { color: "#4f46e5" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
      });
      rzp1.open();
    } catch (err) {
      alert("Failed to initiate payment: " + err.message);
    }
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

  const handleAbsenceSubmit = async (e) => {
    e.preventDefault();
    if (!absenceReasonText.trim()) return showMessage('Reason is required', 'warning');
    
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${BASE_URL}/api/student/submit-absence-reason`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ attendanceId: pendingAbsence.id, reason: absenceReasonText })
      });
      if (res.ok) {
        showMessage('Reason submitted successfully', 'success');
        setPendingAbsence(null);
        setAbsenceReasonText('');
      } else {
        showMessage('Failed to submit reason', 'danger');
      }
    } catch (error) {
      showMessage('Error submitting reason', 'danger');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const categorizedContent = {
    'Recorded sessions': [],
    'Presentations and files': [],
    'Additional study material': [],
    'Question Bank': []
  };

  contents.forEach(curr => {
    let cat = curr.category;
    if (cat === 'Recorded sessions' || cat === 'Recordings' || curr.contentType === 'video') {
      cat = 'Recorded sessions';
    } else if (cat === 'Presentations and files' || cat === 'Presentations' || curr.contentType === 'ppt') {
      cat = 'Presentations and files';
    } else if (cat === 'Question Bank') {
      cat = 'Question Bank';
    } else {
      cat = 'Additional study material'; // Default for PDFs, Docs, etc.
    }

    if (categorizedContent[cat]) {
      categorizedContent[cat].push(curr);
    }
  });

  const getCategoryIcon = (category) => {
    if (category === 'Recordings') return 'fa-play-circle text-danger';
    if (category === 'Study Material') return 'fa-book text-info';
    return 'fa-question-circle text-primary';
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
    <div className="portal-root d-flex flex-column min-vh-100">
      {/* 1. Universal Portal Topbar */}
      <header className="portal-topbar">
        <div className="d-flex align-items-center gap-3">
          {/* Mobile menu toggle */}
          <button 
            className="btn btn-light d-md-none p-2 border rounded-3 shadow-xs" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fa ${isSidebarOpen ? 'fa-times' : 'fa-bars'} fs-5 text-dark`}></i>
          </button>

          {/* Clinidea Brand Logo */}
          <Link to="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="bg-white rounded-3 p-1 d-flex align-items-center justify-content-center border shadow-xs" style={{ width: '42px', height: '42px' }}>
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
              <span className="portal-brand-badge ms-2" style={{ background: '#eef2ff', color: '#4f46e5' }}>Student Portal</span>
            </div>
          </Link>

          {/* Active Batch Badge */}
          {(scheduleData.batchName || (enrolledBatches[0] && enrolledBatches[0].name)) && (
            <span className="badge rounded-pill bg-light text-dark border px-3 py-2 d-none d-lg-inline-flex align-items-center gap-2 shadow-xs ms-2">
              <i className="fa fa-layer-group text-primary"></i>
              <span className="fw-bold">{scheduleData.batchName || enrolledBatches[0].name}</span>
            </span>
          )}
        </div>

        {/* Topbar Right Actions */}
        <div className="d-flex align-items-center gap-3">
          {/* Live Class Pulsing Alert Button */}
          {liveSessions.some(cls => cls.status === 'live') && (
            <button 
              onClick={() => setActiveTab('live')} 
              className="btn btn-danger btn-sm rounded-pill px-3 py-1 fw-bold d-none d-md-flex align-items-center gap-2 shadow-sm heartbeat"
            >
              <i className="fa fa-video"></i> Live Class Now
            </button>
          )}

          {/* Notification Bell */}
          <div className="position-relative">
            <button 
              className="btn btn-light rounded-circle position-relative border" 
              style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <i className="fa fa-bell text-muted"></i>
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="portal-card position-absolute mt-2 p-0 shadow-lg border" style={{ width: '320px', zIndex: 1060, maxHeight: '420px', overflowY: 'auto', right: '-5px' }}>
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                  <h6 className="mb-0 fw-bold text-dark"><i className="fa fa-bell me-2 text-primary"></i>Notifications</h6>
                  {notifications.length > 0 && (
                    <button className="btn btn-sm btn-link text-decoration-none p-0 text-primary fw-semibold" onClick={handleMarkNotificationsRead}>Mark all read</button>
                  )}
                </div>
                <div className="list-group list-group-flush">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted small">No new notifications.</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="list-group-item p-3 border-bottom">
                        <div className="fw-bold mb-1 text-dark" style={{ fontSize: '0.88rem' }}>{n.title}</div>
                        <div className="text-muted small">{n.message}</div>
                        <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>{new Date(n.createdAt).toLocaleTimeString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Avatar Pill */}
          <div className="portal-avatar-pill" onClick={() => setShowProfilePanel(true)} title="Profile & Account Settings">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
              {userContext.fullName ? userContext.fullName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="d-none d-md-block text-start pe-1">
              <div className="fw-bold text-dark lh-1 text-truncate" style={{ maxWidth: '120px', fontSize: '0.85rem' }}>{userContext.fullName || 'Student'}</div>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>Verified Learner</small>
            </div>
            <i className="fa fa-chevron-down text-muted small ms-1 d-none d-md-inline-block" style={{ fontSize: '0.7rem' }}></i>
          </div>
        </div>
      </header>

      {/* 2. Workspace Body (Sidebar + Content) */}
      <div className="d-flex flex-grow-1 position-relative">
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="d-md-none position-fixed w-100 h-100" 
            style={{ top: '68px', left: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 1040, backdropFilter: 'blur(4px)' }}
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Left Sidebar Navigation */}
        <aside className={`portal-sidebar ${isSidebarOpen ? 'open' : ''} portal-scrollbar`}>
          <div className="d-flex flex-column h-100">
            
            {/* Nav Group 1: Academics */}
            <div className="portal-nav-section-title">Academic Portal</div>
            
            {/* 1. Dashboard */}
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'dashboard' ? 'active-student' : ''}`}
            >
              <i className="fa fa-chart-pie"></i>
              <span>Dashboard</span>
            </button>

            {/* 2. Live Classrooms */}
            <button 
              onClick={() => { setActiveTab('live'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'live' ? 'active-student' : ''}`}
            >
              <i className="fa fa-video"></i>
              <span>Live Sessions</span>
              {liveSessions.some(c => c.status === 'live') && (
                <span className="badge bg-danger rounded-pill ms-auto" style={{ fontSize: '0.65rem' }}>LIVE</span>
              )}
            </button>

            {/* 3. Recorded Video Lectures */}
            <button 
              onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Recorded sessions'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'lms' && activeLMSCategory === 'Recorded sessions' ? 'active-student' : ''}`}
            >
              <i className="fa fa-play-circle"></i>
              <span>Recorded Sessions</span>
            </button>

            {/* 4. Study Material & Notes */}
            <button 
              onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Study Material'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'lms' && activeLMSCategory === 'Study Material' ? 'active-student' : ''}`}
            >
              <i className="fa fa-book-open"></i>
              <span>Study Material</span>
            </button>

            {/* 5. Question Bank */}
            <button 
              onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Question Bank'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'lms' && activeLMSCategory === 'Question Bank' ? 'active-student' : ''}`}
            >
              <i className="fa fa-question-circle"></i>
              <span>Question Bank</span>
            </button>

            {/* 6. Test Series & Exams */}
            <button 
              onClick={() => { setActiveTab('test-series'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'test-series' ? 'active-student' : ''}`}
            >
              <i className="fa fa-file-signature"></i>
              <span>Tests & Exams</span>
            </button>

            {/* 7. Assignments */}
            <button 
              onClick={() => { setActiveTab('assignments'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'assignments' ? 'active-student' : ''}`}
            >
              <i className="fa fa-tasks"></i>
              <span>Assignments</span>
            </button>

            {/* Nav Group 2: Vigithink Enterprise Tools */}
            <div className="portal-nav-section-title mt-3">Industry Software</div>
            <div className="p-2 rounded-4 mb-2" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <a 
                href="https://clinidea.in/vigithink/login" 
                target="_blank" 
                rel="noreferrer" 
                className="d-flex align-items-center gap-2 p-2 rounded-3 text-dark text-decoration-none fw-semibold mb-1" 
                style={{ fontSize: '0.82rem', transition: 'background 0.2s' }}
              >
                <i className="fa fa-shield-alt text-success"></i> Vigithink Safety
              </a>
              <a 
                href="https://clinidea.in/vigithinketmf/login" 
                target="_blank" 
                rel="noreferrer" 
                className="d-flex align-items-center gap-2 p-2 rounded-3 text-dark text-decoration-none fw-semibold mb-1" 
                style={{ fontSize: '0.82rem', transition: 'background 0.2s' }}
              >
                <i className="fa fa-folder-open text-warning"></i> Vigithink eTMF
              </a>
              <a 
                href="https://clinidea.in/vigithinkcdms/login" 
                target="_blank" 
                rel="noreferrer" 
                className="d-flex align-items-center gap-2 p-2 rounded-3 text-dark text-decoration-none fw-semibold" 
                style={{ fontSize: '0.82rem', transition: 'background 0.2s' }}
              >
                <i className="fa fa-database text-primary"></i> Vigithink CDMS
              </a>
            </div>

            {/* Nav Group 3: Account & Support */}
            <div className="portal-nav-section-title mt-3">Account & Career</div>

            {/* 8. 24/7 AI Doubt Solver */}
            <button 
              onClick={() => { setActiveTab('ai-tutor'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'ai-tutor' ? 'active-student' : ''}`}
            >
              <i className="fa fa-robot text-primary"></i>
              <span>AI Doubt Solver</span>
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-auto" style={{ fontSize: '0.65rem' }}>24/7</span>
            </button>

            {/* 9. Fees Receipt */}
            <button 
              onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'payments' ? 'active-student' : ''}`}
            >
              <i className="fa fa-receipt"></i>
              <span>Fees & Invoices</span>
            </button>

            {/* 10. Certificates */}
            <button 
              onClick={() => { setActiveTab('vault'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'vault' ? 'active-student' : ''}`}
            >
              <i className="fa fa-certificate"></i>
              <span>Certificates</span>
            </button>

            {/* 11. Refer & Earn */}
            <button 
              onClick={() => { setActiveTab('refer-earn'); setIsSidebarOpen(false); }} 
              className={`portal-nav-btn ${activeTab === 'refer-earn' ? 'active-student' : ''}`}
            >
              <i className="fa fa-gift text-danger"></i>
              <span>Refer & Earn</span>
            </button>

            {/* Profile Settings */}
            <button 
              onClick={() => { setShowProfilePanel(true); setIsSidebarOpen(false); }} 
              className="portal-nav-btn mt-2"
            >
              <i className="fa fa-user-edit"></i>
              <span>Profile Settings</span>
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout} 
              className="portal-nav-btn text-danger mt-1"
            >
              <i className="fa fa-sign-out-alt text-danger"></i>
              <span>Logout</span>
            </button>

          </div>
        </aside>

        {/* 3. Main Dynamic Content Container */}
        <main className="flex-grow-1 p-3 p-md-4 p-xl-5 portal-scrollbar" style={{ minWidth: 0, backgroundColor: '#f8fafc' }}>
          
          {/* Overdue Fee Banner Alert */}
          {payments.some(p => p.paymentStatus === 'pending' && new Date(p.dueDate) < new Date()) && !isFeeBlocked && (
            <div className="alert alert-danger shadow-sm border-2 fw-bold d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 rounded-4 p-3">
              <div className="mb-2 mb-sm-0">
                <i className="fa fa-exclamation-triangle me-2 fs-5"></i>
                You have overdue fee installments! Please clear your dues immediately to avoid account blocking.
              </div>
              <button className="btn btn-danger btn-sm rounded-pill px-4 fw-bold" onClick={() => setActiveTab('payments')}>Pay Now</button>
            </div>
          )}

          {/* Fee Blocked Screen */}
          {isFeeBlocked && activeTab !== 'payments' ? (
            <div className="portal-card text-center py-5 my-4">
              <div className="card-body py-5">
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4 p-4" style={{ width: '90px', height: '90px' }}>
                  <i className="fa fa-lock fs-1"></i>
                </div>
                <h3 className="fw-bold text-danger mb-2">LMS Access Blocked</h3>
                <p className="text-muted fs-5 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
                  {feeBlockMessage || 'Your access has been temporarily revoked due to pending fee installments.'}
                </p>
                <button className="btn btn-danger btn-lg rounded-pill px-5 fw-bold shadow" onClick={() => setActiveTab('payments')}>
                  <i className="fa fa-receipt me-2"></i> View Dues & Pay Online
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="d-flex flex-column gap-4">
                  
                  {/* Hero "Resume Learning" Banner */}
                  <div className="portal-hero-banner">
                    <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
                      <div className="col-lg-8">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.75rem', padding: '6px 14px' }}>
                            <i className="fa fa-sparkles me-1 text-warning"></i> Clinidea Next-Gen LMS 2.0
                          </span>
                          {(scheduleData.batchName || (enrolledBatches[0] && enrolledBatches[0].name)) && (
                            <span className="badge rounded-pill bg-indigo text-white" style={{ background: '#4f46e5', fontSize: '0.75rem', padding: '6px 14px' }}>
                              {scheduleData.batchName || enrolledBatches[0].name}
                            </span>
                          )}
                        </div>
                        <h1 className="fw-bold text-white mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>
                          Welcome back, {userContext.fullName || 'Student'}! 👋
                        </h1>
                        <p className="text-light opacity-75 mb-4" style={{ maxWidth: '600px', fontSize: '1rem', lineHeight: '1.6' }}>
                          Continue your clinical research curriculum, review high-definition video archives, and track your industry skill milestones.
                        </p>
                        
                        <div className="d-flex flex-wrap gap-3">
                          <button 
                            onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Recorded sessions'); }} 
                            className="btn btn-primary rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-lg border-0"
                            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}
                          >
                            <i className="fa fa-play-circle fs-5"></i>
                            <span>Resume Learning</span>
                          </button>
                          
                          <button 
                            onClick={() => setActiveTab('live')} 
                            className="btn btn-outline-light rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2"
                            style={{ borderColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
                          >
                            <i className="fa fa-calendar-alt"></i>
                            <span>View Live Sessions</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Progress Summary inside Hero */}
                      <div className="col-lg-4 mt-4 mt-lg-0">
                        <div className="p-4 rounded-4" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-white-50 small fw-bold text-uppercase">Profile & Verification</span>
                            <span className="text-white fw-bold">{completionPercentage}%</span>
                          </div>
                          <div className="progress mb-3" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '9999px' }}>
                            <div className="progress-bar bg-success" style={{ width: `${completionPercentage}%`, borderRadius: '9999px' }}></div>
                          </div>
                          <p className="text-white-50 small mb-0">
                            {completionPercentage === 100 
                              ? 'Your student profile is 100% verified.' 
                              : 'Upload remaining documents to complete your profile verification.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Modern Stat KPI Cards */}
                  <div className="row g-3 g-md-4">
                    
                    {/* Stat 1: Attendance */}
                    <div className="col-6 col-lg-3">
                      <div className="portal-stat-card h-100">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Attendance</span>
                          <div className="portal-stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
                            <i className="fa fa-user-check"></i>
                          </div>
                        </div>
                        <h3 className="fw-bold text-dark mb-1">85%</h3>
                        <div className="d-flex align-items-center gap-1 text-success small fw-semibold">
                          <i className="fa fa-check-circle"></i> Consistent Attendance
                        </div>
                      </div>
                    </div>

                    {/* Stat 2: Recorded Video Vault */}
                    <div className="col-6 col-lg-3">
                      <div className="portal-stat-card h-100" style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Recorded sessions'); }}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Video Vault</span>
                          <div className="portal-stat-icon-wrapper" style={{ background: '#fef2f2', color: '#ef4444' }}>
                            <i className="fa fa-play"></i>
                          </div>
                        </div>
                        <h3 className="fw-bold text-dark mb-1">{contents.filter(c => c.contentType === 'video').length}</h3>
                        <div className="d-flex align-items-center gap-1 text-muted small">
                          <i className="fa fa-video text-danger"></i> Recorded Lectures
                        </div>
                      </div>
                    </div>

                    {/* Stat 3: Study Notes & Docs */}
                    <div className="col-6 col-lg-3">
                      <div className="portal-stat-card h-100" style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Study Material'); }}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Study Vault</span>
                          <div className="portal-stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                            <i className="fa fa-book-open"></i>
                          </div>
                        </div>
                        <h3 className="fw-bold text-dark mb-1">{contents.filter(c => c.contentType !== 'video').length}</h3>
                        <div className="d-flex align-items-center gap-1 text-muted small">
                          <i className="fa fa-file-pdf text-primary"></i> Documents & PPTs
                        </div>
                      </div>
                    </div>

                    {/* Stat 4: Test & Assignments */}
                    <div className="col-6 col-lg-3">
                      <div className="portal-stat-card h-100" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('test-series')}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Tests & Series</span>
                          <div className="portal-stat-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
                            <i className="fa fa-award"></i>
                          </div>
                        </div>
                        <h3 className="fw-bold text-dark mb-1">{exams.length}</h3>
                        <div className="d-flex align-items-center gap-1 text-warning small fw-semibold">
                          <i className="fa fa-edit"></i> Exams & Quizzes
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Academic Modules & Tools Grid */}
                  <div className="row g-4">
                    
                    {/* Left 8 Cols: Quick Action Grid */}
                    <div className="col-lg-8">
                      <div className="portal-card p-4">
                        <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                          <i className="fa fa-rocket text-primary"></i> Learning Modules Quick Access
                        </h5>
                        <div className="row g-3">
                          
                          {/* Card: Live Space */}
                          <div className="col-sm-6">
                            <div 
                              className="p-3 rounded-4 border bg-white h-100 d-flex flex-column justify-content-between" 
                              style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                              onClick={() => setActiveTab('live')}
                              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            >
                              <div className="d-flex align-items-center gap-3 mb-2">
                                <div className="p-3 rounded-3 bg-danger bg-opacity-10 text-danger">
                                  <i className="fa fa-video fs-4"></i>
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0 text-dark">Live Classroom</h6>
                                  <small className="text-muted">Interactive live lectures</small>
                                </div>
                              </div>
                              <span className="text-primary fw-semibold small mt-2 d-inline-flex align-items-center gap-1">
                                Enter Classroom <i className="fa fa-arrow-right"></i>
                              </span>
                            </div>
                          </div>

                          {/* Card: Recorded Video Vault */}
                          <div className="col-sm-6">
                            <div 
                              className="p-3 rounded-4 border bg-white h-100 d-flex flex-column justify-content-between" 
                              style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                              onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Recorded sessions'); }}
                              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            >
                              <div className="d-flex align-items-center gap-3 mb-2">
                                <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                                  <i className="fa fa-play-circle fs-4"></i>
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0 text-dark">Lecture Archive</h6>
                                  <small className="text-muted">High-definition recordings</small>
                                </div>
                              </div>
                              <span className="text-primary fw-semibold small mt-2 d-inline-flex align-items-center gap-1">
                                Browse Videos <i className="fa fa-arrow-right"></i>
                              </span>
                            </div>
                          </div>

                          {/* Card: Assignments */}
                          <div className="col-sm-6">
                            <div 
                              className="p-3 rounded-4 border bg-white h-100 d-flex flex-column justify-content-between" 
                              style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                              onClick={() => setActiveTab('assignments')}
                              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            >
                              <div className="d-flex align-items-center gap-3 mb-2">
                                <div className="p-3 rounded-3 bg-warning bg-opacity-10 text-warning">
                                  <i className="fa fa-tasks fs-4"></i>
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0 text-dark">Assignments</h6>
                                  <small className="text-muted">Submit and view feedback</small>
                                </div>
                              </div>
                              <span className="text-primary fw-semibold small mt-2 d-inline-flex align-items-center gap-1">
                                View Tasks <i className="fa fa-arrow-right"></i>
                              </span>
                            </div>
                          </div>

                          {/* Card: 24/7 AI Doubt Solver */}
                          <div className="col-sm-6">
                            <div 
                              className="p-3 rounded-4 border bg-white h-100 d-flex flex-column justify-content-between" 
                              style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                              onClick={() => setActiveTab('ai-tutor')}
                              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            >
                              <div className="d-flex align-items-center gap-3 mb-2">
                                <div className="p-3 rounded-3 bg-info bg-opacity-10 text-info">
                                  <i className="fa fa-robot fs-4"></i>
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0 text-dark">AI Doubt Solver</h6>
                                  <small className="text-muted">Instant clinical clarification</small>
                                </div>
                              </div>
                              <span className="text-primary fw-semibold small mt-2 d-inline-flex align-items-center gap-1">
                                Ask Questions <i className="fa fa-arrow-right"></i>
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Right 4 Cols: Vigithink Clinical Software */}
                    <div className="col-lg-4">
                      <div className="portal-card p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h5 className="fw-bold text-dark mb-0"><i className="fa fa-laptop-code text-success me-2"></i>Vigithink Suite</h5>
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-bold">Live Clinical</span>
                          </div>
                          <p className="text-muted small mb-4">
                            Gain hands-on clinical industry experience with simulated regulatory software environments.
                          </p>

                          <div className="d-flex flex-column gap-2">
                            <a 
                              href="https://clinidea.in/vigithink/login" 
                              target="_blank" 
                              rel="noreferrer" 
                              className="d-flex align-items-center justify-content-between p-3 rounded-3 border text-decoration-none text-dark bg-light hover-bg-white"
                            >
                              <div className="d-flex align-items-center gap-2">
                                <i className="fa fa-shield-alt text-success fs-5"></i>
                                <span className="fw-bold small">Vigithink Safety (PV)</span>
                              </div>
                              <i className="fa fa-external-link-alt text-muted small"></i>
                            </a>

                            <a 
                              href="https://clinidea.in/vigithinketmf/login" 
                              target="_blank" 
                              rel="noreferrer" 
                              className="d-flex align-items-center justify-content-between p-3 rounded-3 border text-decoration-none text-dark bg-light hover-bg-white"
                            >
                              <div className="d-flex align-items-center gap-2">
                                <i className="fa fa-folder-open text-warning fs-5"></i>
                                <span className="fw-bold small">Vigithink eTMF</span>
                              </div>
                              <i className="fa fa-external-link-alt text-muted small"></i>
                            </a>

                            <a 
                              href="https://clinidea.in/vigithinkcdms/login" 
                              target="_blank" 
                              rel="noreferrer" 
                              className="d-flex align-items-center justify-content-between p-3 rounded-3 border text-decoration-none text-dark bg-light hover-bg-white"
                            >
                              <div className="d-flex align-items-center gap-2">
                                <i className="fa fa-database text-primary fs-5"></i>
                                <span className="fw-bold small">Vigithink CDMS</span>
                              </div>
                              <i className="fa fa-external-link-alt text-muted small"></i>
                            </a>
                          </div>
                        </div>

                        <div className="mt-4 p-3 rounded-3 bg-light border text-center">
                          <small className="text-muted d-block">
                            <i className="fa fa-info-circle me-1 text-primary"></i> Single sign-on credentials are provided upon batch commencement.
                          </small>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: LMS CONTENT VAULT */}
              {activeTab === 'lms' && (
                <div className="d-flex flex-column gap-4">
                  {/* Category Filter Pills */}
                  <div className="portal-card p-3 d-flex flex-wrap gap-2 align-items-center justify-content-between">
                    <div className="d-flex flex-wrap gap-2">
                      {['Recorded sessions', 'Study Material', 'Question Bank'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveLMSCategory(cat)}
                          className={`btn rounded-pill px-4 py-2 fw-bold text-sm ${activeLMSCategory === cat ? 'btn-primary shadow-sm' : 'btn-light border text-muted'}`}
                        >
                          <i className={`fa ${getCategoryIcon(cat)} me-2`}></i>
                          {cat}
                        </button>
                      ))}
                    </div>

                    <Link to="/student/lms" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold text-sm d-flex align-items-center gap-2">
                      <i className="fa fa-tv"></i> Switch to Cinema Player View
                    </Link>
                  </div>

                  {/* Items Grid */}
                  <div className="portal-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                      <div>
                        <h4 className="fw-bold text-dark mb-1">
                          <i className={`fa ${getCategoryIcon(activeLMSCategory)} text-primary me-2`}></i>
                          {activeLMSCategory}
                        </h4>
                        <p className="text-muted small mb-0">Showing available resources for your batch curriculum.</p>
                      </div>
                      <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-bold">
                        {currentItems.length} Available
                      </span>
                    </div>

                    {currentItems.length === 0 ? (
                      <div className="text-center py-5">
                        <div className="bg-light rounded-circle d-flex justify-content-center align-items-center mb-4 mx-auto" style={{ width: '80px', height: '80px' }}>
                          <i className={`fa ${getCategoryIcon(activeLMSCategory)} fs-2 text-muted`}></i>
                        </div>
                        <h5 className="fw-bold text-dark mb-1">No content available in this category yet.</h5>
                        <p className="text-muted small">Your mentors will upload materials shortly.</p>
                      </div>
                    ) : (
                      <div className="row g-4">
                        {currentItems.map(item => (
                          <div key={item.id} className="col-md-6 col-lg-4 col-xl-3">
                            <div 
                              className="portal-card h-100 d-flex flex-column"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                let contentUrl = null;
                                if (item.localFileUrl) {
                                  contentUrl = `${BASE_URL}${item.localFileUrl}`;
                                } else if (item.driveWebViewLink) {
                                  contentUrl = item.driveWebViewLink;
                                }
                                if (contentUrl) {
                                  const url = `/watch?link=${encodeURIComponent(contentUrl)}&title=${encodeURIComponent(item.title)}&type=${item.contentType}`;
                                  navigate(url);
                                }
                              }}
                            >
                              {/* 16:9 Thumbnail Area */}
                              <div 
                                className="position-relative w-100" 
                                style={{ 
                                  aspectRatio: '16/9', 
                                  background: item.contentType === 'video' ? 'linear-gradient(135deg, #090e17 0%, #1e293b 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                  display: 'flex', 
                                  justifyContent: 'center', 
                                  alignItems: 'center',
                                  overflow: 'hidden'
                                }}
                              >
                                <div className="rounded-circle d-flex justify-content-center align-items-center shadow-lg" style={{ width: '52px', height: '52px', background: item.contentType === 'video' ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.1)', backdropFilter: 'blur(8px)' }}>
                                  <i className={`fa ${item.contentType === 'video' ? 'fa-play text-white ms-1' : 'fa-file-alt text-dark'} fs-4`}></i>
                                </div>

                                <div className="position-absolute" style={{ top: '12px', left: '12px', zIndex: 5 }}>
                                  <span className="badge rounded-pill" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.7rem', padding: '5px 10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {item.moduleName || 'General Topic'}
                                  </span>
                                </div>

                                <div className="position-absolute" style={{ bottom: '10px', right: '10px', zIndex: 5 }}>
                                  <span className="badge rounded bg-dark text-white opacity-75" style={{ fontSize: '0.65rem', padding: '4px 6px' }}>
                                    {item.contentType === 'video' ? '1080p DRM' : 'Document'}
                                  </span>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="p-3 d-flex flex-column flex-grow-1 bg-white">
                                <h6 className="fw-bold text-dark mb-1 text-truncate" title={item.title}>{item.title}</h6>
                                <p className="text-muted small mb-0 text-truncate" style={{ fontSize: '0.8rem' }}>
                                  {item.description || (item.contentType === 'video' ? 'Clinidea Interactive Lecture' : 'Downloadable Study Material')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE SESSIONS */}
              {activeTab === 'live' && (
                <div className="portal-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <div>
                      <h4 className="fw-bold text-dark mb-1"><i className="fa fa-video text-danger me-2"></i>Upcoming & Live Sessions</h4>
                      <p className="text-muted small mb-0">Join your interactive classes via Clinidea Space.</p>
                    </div>
                  </div>

                  {liveSessions.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="bg-light rounded-circle d-flex justify-content-center align-items-center mb-4 mx-auto" style={{ width: '80px', height: '80px' }}>
                        <i className="fa fa-calendar-times text-muted fs-2"></i>
                      </div>
                      <h5 className="fw-bold text-dark">No Live Sessions Found</h5>
                      <p className="text-muted small">You currently have no scheduled live classes.</p>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {liveSessions.map(cls => (
                        <div key={cls.id} className="col-md-6 col-lg-4">
                          <div className="portal-card h-100 overflow-hidden" style={{ border: cls.status === 'live' ? '2px solid #ef4444' : '1px solid #e2e8f0' }}>
                            <div className="p-3" style={{ background: cls.status === 'live' ? '#ef4444' : 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}>
                              <h6 className="fw-bold mb-0 text-white d-flex justify-content-between align-items-center">
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
                                className="btn w-100 text-center text-decoration-none d-block fw-bold shadow-sm rounded-pill py-2" 
                                style={{ backgroundColor: cls.status === 'live' ? '#ef4444' : '#4f46e5', color: 'white' }}
                              >
                                {cls.status === 'live' ? 'Join Live Class Now' : 'Enter Meeting Space'} <i className="fa fa-external-link-alt ms-2"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CERTIFICATES VAULT */}
              {activeTab === 'vault' && (
                <div className="portal-card p-4">
                  <h4 className="fw-bold text-dark mb-1"><i className="fa fa-certificate text-warning me-2"></i>My Certificates</h4>
                  <p className="text-muted small mb-4">Official accredited certificates issued upon program completion.</p>

                  {certificates.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center p-4 mb-3" style={{ width: '80px', height: '80px' }}>
                        <i className="fa fa-award text-muted fs-2"></i>
                      </div>
                      <h6 className="fw-bold text-dark">No certificates issued yet.</h6>
                      <p className="text-muted small">Certificates will be published here upon fulfilling academic criteria.</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {certificates.map(cert => (
                        <div key={cert.id} className="p-3 border rounded-4 d-flex justify-content-between align-items-center bg-white shadow-xs">
                          <div>
                            <h6 className="fw-bold mb-1 text-dark">{cert.course?.name || "Course"}</h6>
                            <span className="badge mb-1" style={{ background: '#fffbeb', color: '#f59e0b', border: '1px solid #fcd34d' }}>{cert.certificateType}</span>
                            <div className="small text-muted">Verification ID: {cert.certificateId}</div>
                          </div>
                          <a href={`${BASE_URL}${cert.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm">
                            <i className="fa fa-download me-1"></i> Download
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PAYMENTS & INVOICES */}
              {activeTab === 'payments' && (
                <StudentPayments payments={payments} fetchDashboardData={fetchDashboardData} />
              )}

              {/* TAB 6: ASSIGNMENTS */}
              {activeTab === 'assignments' && (
                <StudentAssignments assignments={assignments} showMessage={(t, ty) => setMessage({text: t, type: ty})} fetchDashboardData={fetchDashboardData} />
              )}

              {/* TAB 7: TEST SERIES */}
              {activeTab === 'test-series' && (
                <StudentExams exams={exams} showMessage={(t, ty) => setMessage({text: t, type: ty})} fetchDashboardData={fetchDashboardData} />
              )}

              {/* TAB 8: REFER AND EARN */}
              {activeTab === 'refer-earn' && (
                <div className="portal-card p-4 p-md-5 text-center">
                  <div className="py-4">
                    <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                      <i className="fa fa-gift fs-1"></i>
                    </div>
                    <h3 className="fw-bold text-dark mb-2">Refer your friends & earn rewards!</h3>
                    <p className="text-muted mx-auto mb-4" style={{ maxWidth: '500px' }}>
                      Share Clinidea Education with clinical research aspirants. When they enroll, both of you unlock certified workshop access and tuition credits!
                    </p>
                    <button 
                      className="btn btn-danger px-5 py-3 rounded-pill fw-bold shadow-sm"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(`https://clinidea.in/courses`);
                          alert('Clinidea referral link copied to clipboard!');
                        }
                      }}
                    >
                      <i className="fa fa-share-alt me-2"></i> Copy Referral Link
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 9: 24/7 AI DOUBT SOLVER (Properly scoped inside main content area!) */}
              {activeTab === 'ai-tutor' && (
                <div className="portal-card p-4">
                  <StudentAITutor />
                </div>
              )}

            </>
          )}

        </main>
      </div>

      {/* 4. Slide-Over Profile & Verification Drawer */}
      {showProfilePanel && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowProfilePanel(false)}></div>
          <div className="bg-white shadow-2xl overflow-auto portal-scrollbar" style={{ position: 'fixed', top: 0, right: 0, width: '480px', maxWidth: '100%', height: '100vh', zIndex: 1060, borderLeft: '1px solid var(--portal-border)' }}>
            
            <div className="p-4 d-flex justify-content-between align-items-center position-sticky top-0 bg-white border-bottom" style={{ zIndex: 10 }}>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                  <i className="fa fa-user-cog"></i>
                </div>
                <h5 className="fw-bold mb-0 text-dark">Profile & Verification</h5>
              </div>
              <button onClick={() => setShowProfilePanel(false)} className="btn btn-light rounded-circle p-2 border" style={{ width: '36px', height: '36px' }}><i className="fa fa-times"></i></button>
            </div>
            
            <div className="p-4 bg-light min-vh-100">
              {message.text && <div className={`alert alert-${message.type} small fw-bold shadow-sm rounded-3`}>{message.text}</div>}
              
              {/* Document Vault Upload */}
              <div className="portal-card p-4 mb-4">
                <h6 className="fw-bold mb-3 text-primary"><i className="fa fa-shield-check me-2"></i>KYC Document Verification</h6>
                <form onSubmit={handleFileUpload} className="p-3 rounded-4 bg-light border">
                  <label className="form-label small fw-bold text-muted">Select Document Type</label>
                  <select className="form-select mb-3 bg-white" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                    <option value="photo">Passport Photo</option>
                    <option value="id_proof">Government ID / Aadhar</option>
                    <option value="education_certificate">Degree / Transcript</option>
                  </select>
                  <label className="form-label small fw-bold text-muted">Upload File</label>
                  <input type="file" className="form-control bg-white mb-3" onChange={(e) => setSelectedFile(e.target.files[0])} />
                  <button type="submit" disabled={uploading} className="btn btn-primary w-100 py-2 rounded-pill fw-bold shadow-sm border-0">
                    {uploading ? 'Uploading...' : 'Upload Securely'}
                  </button>
                </form>
                
                {documents.length > 0 && (
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {documents.map(doc => (
                      <span key={doc.id} className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-xs">
                        <i className="fa fa-check-circle me-1 text-success"></i> {doc.documentType.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Demographics Form */}
              <div className="portal-card p-4 mb-4">
                <h6 className="fw-bold mb-3 text-primary"><i className="fa fa-user-edit me-2"></i>Student Demographics</h6>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Date of Birth</label>
                    <input type="date" className="form-control" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleProfileChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Gender</label>
                    <select className="form-select" name="gender" value={profile.gender} onChange={handleProfileChange}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Address</label>
                    <input type="text" className="form-control" name="address" value={profile.address} onChange={handleProfileChange} />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-bold text-muted">City</label>
                      <input type="text" className="form-control" name="city" value={profile.city} onChange={handleProfileChange} />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-bold text-muted">State</label>
                      <input type="text" className="form-control" name="state" value={profile.state} onChange={handleProfileChange} />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-bold text-muted">Pin</label>
                      <input type="text" className="form-control" name="pincode" value={profile.pincode} onChange={handleProfileChange} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Qualification</label>
                    <input type="text" className="form-control" name="qualification" value={profile.qualification} onChange={handleProfileChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">College</label>
                    <input type="text" className="form-control" name="collegeName" value={profile.collegeName} onChange={handleProfileChange} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Grad Year</label>
                    <input type="text" className="form-control" name="graduationYear" value={profile.graduationYear} onChange={handleProfileChange} />
                  </div>
                  
                  <button type="submit" disabled={saving} className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm">
                    {saving ? 'Saving...' : 'Save Profile Details'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </>
      )}

      {/* 5. Student Absence Reason Modal */}
      {pendingAbsence && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.85)', zIndex: 1070 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-2xl">
              <div className="modal-header bg-danger text-white border-bottom-0 rounded-top-4">
                <h5 className="modal-title fw-bold"><i className="fas fa-exclamation-triangle me-2"></i> Action Required: Absence Recorded</h5>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="fs-5 mb-2">You were marked <strong>absent</strong> for the session on:</p>
                <div className="bg-light p-3 rounded-3 mb-4 d-inline-block fw-bold text-dark shadow-sm">
                  {new Date(pendingAbsence.session?.sessionDate).toLocaleDateString()} - {pendingAbsence.session?.title}
                </div>
                <p className="text-muted mb-4">Please provide a valid reason for your absence to continue using the portal.</p>
                
                <form onSubmit={handleAbsenceSubmit}>
                  <textarea 
                    className="form-control mb-4 bg-light" 
                    rows="3" 
                    required 
                    placeholder="Enter your reason here..."
                    value={absenceReasonText}
                    onChange={(e) => setAbsenceReasonText(e.target.value)}
                  ></textarea>
                  <button type="submit" className="btn btn-danger fw-bold rounded-pill w-100 py-2 fs-5 shadow">
                    Submit Reason & Continue
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;

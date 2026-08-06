import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import MentorExams from '../components/mentor/MentorExams';
import MentorAssignments from '../components/mentor/MentorAssignments';
import MentorSchedule from '../components/mentor/MentorSchedule';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState('batches'); // batches, uploads, exams, assignments
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Upload State
  const [uploadData, setUploadData] = useState({ title: '', description: '', category: 'Study Material', moduleName: 'General' });
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return showMessage('Please select a batch first', 'warning');
    if (!uploadFile) return showMessage('Please select a file to upload', 'warning');

    const formData = new FormData();
    formData.append('batchId', selectedBatch.id);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('category', uploadData.category);
    formData.append('moduleName', uploadData.moduleName);
    formData.append('file', uploadFile);

    setIsUploading(true);
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/lms-upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        showMessage('File uploaded successfully!');
        setUploadData({ title: '', description: '', category: 'Study Material', moduleName: 'General' });
        setUploadFile(null);
        document.getElementById('fileInput').value = '';
      } else {
        const data = await res.json();
        showMessage(data.error || 'Upload failed', 'danger');
      }
    } catch (error) {
      showMessage('Upload error', 'danger');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchMentorData = async () => {
    const token = localStorage.getItem('mentorToken');
    if (!token) {
      navigate('/mentor/login');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/mentor/batches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBatches(data.batches || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('mentorToken');
    navigate('/mentor/login');
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const navItems = [
    { id: 'batches', icon: 'fa-users', label: 'My Batches' },
    { id: 'schedule', icon: 'fa-calendar-alt', label: 'Schedule Session' },
    { id: 'uploads', icon: 'fa-upload', label: 'Upload Content' },
    { id: 'exams', icon: 'fa-file-alt', label: 'Test & Exam' },
    { id: 'assignments', icon: 'fa-tasks', label: 'Assignments' }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Helmet>
        <title>Mentor Dashboard | Clinidea</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
             style={{ opacity: 0.5, zIndex: 1040 }}
             onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`bg-white shadow-sm d-flex flex-column transition-all duration-300 ${isSidebarOpen ? 'position-fixed h-100 w-75' : 'd-none d-md-flex'}`}
           style={{ width: '280px', zIndex: 1045, borderRight: '1px solid #eee' }}>
        <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
          <h4 className="mb-0 fw-bold text-primary">Mentor Portal</h4>
          <button className="btn d-md-none border-0" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times fs-5 text-secondary"></i>
          </button>
        </div>
        <div className="p-3 flex-grow-1 overflow-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`btn w-100 text-start mb-2 py-3 px-4 rounded-3 d-flex align-items-center ${activeTab === item.id ? 'btn-primary text-white shadow-sm' : 'btn-light text-dark hover-shadow'}`}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              style={{ transition: 'all 0.2s', fontWeight: activeTab === item.id ? '600' : '500' }}
            >
              <i className={`fas ${item.icon} me-3 fs-5 ${activeTab === item.id ? 'text-white' : 'text-primary'}`}></i>
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-top text-center">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100 rounded-3 py-2 fw-bold">
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Header */}
        <div className="bg-white p-3 px-4 shadow-sm d-flex align-items-center justify-content-between sticky-top" style={{ zIndex: 1030 }}>
          <div className="d-flex align-items-center">
            <button className="btn d-md-none border-0 me-2" onClick={() => setIsSidebarOpen(true)}>
              <i className="fas fa-bars fs-4 text-primary"></i>
            </button>
            <h5 className="mb-0 fw-bold text-dark d-none d-sm-block">
              {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
            </h5>
          </div>
          <div className="d-flex align-items-center">
             <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: '40px', height: '40px' }}>
                <i className="fas fa-user-tie"></i>
             </div>
          </div>
        </div>

        {message.text && (
          <div className="container-fluid px-4 pt-3">
             <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                {message.text}
             </div>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="container-fluid p-4 overflow-auto">
          {activeTab === 'batches' && (
            <div className="row g-4">
              <div className="col-12"><h4 className="fw-bold mb-3">Assigned Batches</h4></div>
              {batches.map(b => (
                <div key={b.id} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4 text-center">
                      <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                         <i className="fas fa-graduation-cap fs-3"></i>
                      </div>
                      <h5 className="fw-bold">{b.name}</h5>
                      <p className="text-muted small mb-3">{b.course?.title || 'Unknown Course'}</p>
                      <button className="btn btn-outline-primary btn-sm w-100 rounded-pill" onClick={() => { setSelectedBatch(b); setActiveTab('schedule'); }}>
                        Manage Batch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {batches.length === 0 && <div className="text-center text-muted py-5">No batches assigned to you yet.</div>}
            </div>
          )}

          {activeTab === 'schedule' && (
            <MentorSchedule selectedBatch={selectedBatch} showMessage={showMessage} />
          )}

          {activeTab === 'uploads' && (
            <div>
              <h4 className="fw-bold mb-3">Upload Material</h4>
              {selectedBatch ? (
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <form onSubmit={handleUpload}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Title</label>
                          <input type="text" className="form-control" required 
                                 value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Category</label>
                          <select className="form-select" value={uploadData.category} onChange={e => setUploadData({...uploadData, category: e.target.value})}>
                            <option>Live session Schedules</option>
                            <option>Recorded sessions</option>
                            <option>Presentations and files</option>
                            <option>Additional study material</option>
                            <option>Question Bank</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Module Name</label>
                          <input type="text" className="form-control" placeholder="e.g. Module 1" required
                                 value={uploadData.moduleName} onChange={e => setUploadData({...uploadData, moduleName: e.target.value})} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Select File</label>
                          <input type="file" id="fileInput" className="form-control" required onChange={e => setUploadFile(e.target.files[0])} />
                          <small className="text-muted">Videos, PDFs, PPTs allowed. (Max 500MB)</small>
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Description (Optional)</label>
                          <textarea className="form-control" rows="3" 
                                    value={uploadData.description} onChange={e => setUploadData({...uploadData, description: e.target.value})}></textarea>
                        </div>
                        <div className="col-12 mt-4">
                          <button type="submit" className="btn btn-primary fw-bold rounded-3 px-4" disabled={isUploading}>
                            {isUploading ? 'Uploading (Please wait)...' : 'Upload File'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">Please select a batch from "My Batches" first.</div>
              )}
            </div>
          )}

          {activeTab === 'exams' && (
            <MentorExams selectedBatch={selectedBatch} showMessage={showMessage} />
          )}

          {activeTab === 'assignments' && (
            <MentorAssignments selectedBatch={selectedBatch} showMessage={showMessage} />
          )}

        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;

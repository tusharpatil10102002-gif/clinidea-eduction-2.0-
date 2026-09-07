import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

function AdminLMS() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [contents, setContents] = useState([]);
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Tabs
  const [activeTab, setActiveTab] = useState('content'); // content, live-sessions

  // Live Sessions State
  const [liveSessions, setLiveSessions] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    title: '', sessionTime: '', startDate: '', endDate: '', isRecurring: false, recurrenceType: 'daily'
  });
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [folderType, setFolderType] = useState('Additional Study Material');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState(null);

  // Filter & Preview State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [previewModalContent, setPreviewModalContent] = useState(null);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editModule, setEditModule] = useState('');
  
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminRole = localStorage.getItem('adminRole') || 'superadmin';

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      const batchesRes = await fetch(`${BASE_URL}/api/mentor/batches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const batchData = await batchesRes.json();
      setBatches(Array.isArray(batchData) ? batchData : []);
      
      if (adminRole !== 'mentor') {
        const delRes = await fetch(`${BASE_URL}/api/admin/lms/delete-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (delRes.ok) {
          const delData = await delRes.json();
          setDeleteRequests(Array.isArray(delData) ? delData : []);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch initial data', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchContent = async (batchId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/batches/${batchId}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch content');
    }
  };

  const fetchLiveSessions = async (batchId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/batches/${batchId}/live-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLiveSessions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch live sessions');
    }
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setModuleName(batch.moduleName || ''); // Auto-fill for mentors
    fetchContent(batch.id);
    fetchLiveSessions(batch.id);
  };

  // --- Live Session & Recording Logic ---
  
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (isEditingSession) {
        const res = await fetch(`${BASE_URL}/api/admin/sessions/${editingSessionId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            batch_id: selectedBatch.id,
            session_date: scheduleData.startDate,
            session_time: scheduleData.sessionTime,
            meeting_link: `/live/${selectedBatch.id}`,
            recurrence: scheduleData.isRecurring ? scheduleData.recurrenceType : 'none',
            title: scheduleData.title
          })
        });
        if (res.ok) {
          alert('Session updated successfully');
          setShowScheduleForm(false);
          setIsEditingSession(false);
          setEditingSessionId(null);
          setScheduleData({
            title: '', sessionTime: '', startDate: '', endDate: '', isRecurring: false, recurrenceType: 'daily'
          });
          fetchLiveSessions(selectedBatch.id);
        } else {
          alert('Failed to update session');
        }
        return;
      }

      const res = await fetch(`${BASE_URL}/api/mentor/schedule-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ ...scheduleData, batchId: selectedBatch.id })
      });
      if (res.ok) {
        alert('Sessions scheduled successfully');
        setShowScheduleForm(false);
        setScheduleData({
          title: '', sessionTime: '', startDate: '', endDate: '', isRecurring: false, recurrenceType: 'daily'
        });
        fetchLiveSessions(selectedBatch.id);
      } else {
        alert('Failed to schedule sessions');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving session');
    }
  };

  const handleGoLive = async (sessionId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/session/${sessionId}/live`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Session is now LIVE! Notifications sent to students.');
        // Instantly launch the Jitsi classroom tab for the instructor with exact Course Name & Mentor role!
        window.open(`https://jitsi.belnet.be/Clinidea_LiveClass_Batch_${selectedBatch.id}_${sessionId}#userInfo.displayName="${encodeURIComponent('Mentor / Instructor')}"&config.prejoinPageEnabled=false`, '_blank');
        fetchLiveSessions(selectedBatch.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this scheduled session?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Session deleted successfully.');
        fetchLiveSessions(selectedBatch.id);
      } else {
        alert('Failed to delete session.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting session.');
    }
  };

  const handleEditSessionStart = (session) => {
    setIsEditingSession(true);
    setEditingSessionId(session.id);
    setScheduleData({
      title: session.title || '',
      sessionTime: session.sessionTime || '',
      startDate: session.sessionDate ? session.sessionDate.split('T')[0] : '',
      isRecurring: session.recurrence && session.recurrence !== 'none',
      recurrenceType: session.recurrence === 'daily' || session.recurrence === 'weekly' ? session.recurrence : 'daily',
      endDate: session.endDate ? session.endDate.split('T')[0] : ''
    });
    setShowScheduleForm(true);
  };


  const handleApproveDelete = async (id, action) => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      const res = await fetch(`${BASE_URL}/api/admin/lms/delete-requests/${id}/${endpoint}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert(`Delete request ${action}d successfully`);
        setDeleteRequests(deleteRequests.filter(req => req.id !== id));
        if (selectedBatch) fetchContent(selectedBatch.id);
      }
    } catch (err) {
      console.error('Failed to process delete request');
    }
  };

  // --- Content Actions ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    if (folderType === 'Recorded Sessions' && !file && !youtubeUrl) {
      alert("Please enter a YouTube video link or select a video file.");
      return;
    }
    if (folderType !== 'Recorded Sessions' && !file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('batchId', selectedBatch.id);
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('moduleName', moduleName || 'General');
    formData.append('category', folderType);
    if (youtubeUrl) formData.append('youtubeUrl', youtubeUrl);
    if (file) formData.append('file', file);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/lms-upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('Material published and saved to LMS successfully!');
        setTitle('');
        setDescription('');
        setModuleName('');
        setYoutubeUrl('');
        setFile(null);
        e.target.reset();
        fetchContent(selectedBatch.id);
        const formSec = document.getElementById('uploadFormSection');
        if (formSec) formSec.style.display = 'none';
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to upload');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm("Are you sure you want to delete this LMS file/material completely? It will be permanently removed from Google Drive and LMS database.")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/content/${contentId}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      if (res.ok) {
        alert("LMS content deleted completely.");
        fetchContent(selectedBatch.id);
      } else {
        alert("Failed to delete LMS content.");
      }
    } catch (err) {
      console.error("Failed to delete content", err);
      alert("Error deleting LMS content.");
    }
  };

  const handleEditSave = async (contentId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/content/${contentId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title: editTitle, moduleName: editModule })
      });
      if (res.ok) {
        setEditingId(null);
        fetchContent(selectedBatch.id);
      } else {
        alert("Failed to update content");
      }
    } catch (err) {
      console.error("Error updating content", err);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'video': return 'fa-video text-danger';
      case 'pdf': return 'fa-file-pdf text-danger';
      case 'ppt': return 'fa-file-powerpoint text-warning';
      default: return 'fa-file-alt text-primary';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <h2 className="heading-premium mb-0">LMS & Drive Management</h2>
          </div>
        </div>

          <div className="row">
            {/* Batches Sidebar */}
            <div className="col-lg-4 mb-4">
              <div className="card-premium">
                <div className="card-header bg-white border-0 pt-4 pb-2" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                  <h5 className="heading-premium mb-0">{adminRole === 'mentor' ? 'My Assigned Batches' : 'All Batches'}</h5>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary"></div></div>
                  ) : batches.length === 0 ? (
                    <p className="text-muted text-center py-3">No batches found.</p>
                  ) : (
                    <div className="list-group list-group-flush" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      {batches.map(batch => (
                        <button 
                          key={batch.id} 
                          className={`list-group-item list-group-item-action border-0 rounded-3 mb-2 p-3 ${selectedBatch?.id === batch.id ? 'bg-primary text-white shadow-sm' : 'bg-light'}`}
                          onClick={() => handleBatchSelect(batch)}
                        >
                          <h6 className="fw-bold mb-1">{batch.batchName}</h6>
                          <small className={selectedBatch?.id === batch.id ? 'text-white-50' : 'text-muted'}>
                            {batch.course?.name}
                          </small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="col-lg-8">
              {!selectedBatch ? (
                <div className="card-premium text-center py-5" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="card-body">
                    <div className="mb-4"><i className="fa fa-chalkboard-teacher text-muted opacity-25" style={{ fontSize: '4rem' }}></i></div>
                    <h3 className="heading-premium text-dark mb-3">Welcome to LMS Control Center</h3>
                    <p className="text-muted fs-5">Please select a batch from the left menu to start.</p>
                  </div>
                </div>
              ) : (
                <>

                  {/* Tabs */}
                  <div className="nav nav-pills mb-4 gap-3">
                    <button className={`btn-premium px-4 py-2 ${activeTab === 'content' ? 'btn-primary-theme' : 'bg-white text-muted border'}`} onClick={() => setActiveTab('content')}>
                      <i className="fa fa-folder-open me-2"></i> Content Library
                    </button>
                    <button className={`btn-premium px-4 py-2 ${activeTab === 'live-sessions' ? 'btn-primary-theme' : 'bg-white text-muted border'}`} onClick={() => setActiveTab('live-sessions')}>
                      <i className="fa fa-video me-2"></i> Live Sessions
                    </button>
                  </div>

                  {activeTab === 'content' ? (
                    <>
                      {/* Batch Summary Stats */}
                      <div className="row g-3 mb-4">
                        <div className="col-sm-4">
                          <div className="card-premium p-3 bg-white border d-flex align-items-center gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary" style={{ width: '48px', height: '48px' }}>
                              <i className="fa fa-folder-open fs-5"></i>
                            </div>
                            <div>
                              <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>Total Materials</small>
                              <h4 className="fw-bold mb-0 text-dark">{contents.length}</h4>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="card-premium p-3 bg-white border d-flex align-items-center gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger" style={{ width: '48px', height: '48px' }}>
                              <i className="fa fa-video fs-5"></i>
                            </div>
                            <div>
                              <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>Video Recordings</small>
                              <h4 className="fw-bold mb-0 text-dark">{contents.filter(c => c.contentType === 'video').length}</h4>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="card-premium p-3 bg-white border d-flex align-items-center gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success" style={{ width: '48px', height: '48px' }}>
                              <i className="fa fa-file-alt fs-5"></i>
                            </div>
                            <div>
                              <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>PPTs & Documents</small>
                              <h4 className="fw-bold mb-0 text-dark">{contents.filter(c => c.contentType !== 'video').length}</h4>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Action Buttons */}
                      <div className="card-premium mb-4 bg-light">
                        <div className="card-body p-4 text-center">
                          <h4 className="heading-premium mb-4">LMS Control Center: {selectedBatch.batchName}</h4>
                          <div className="d-flex flex-column flex-sm-row flex-wrap justify-content-center gap-3">
                            <button 
                              className="btn-premium px-4 py-3" style={{ backgroundColor: '#ef4444', color: 'white' }}
                              onClick={() => {
                                setFolderType('Recorded Sessions');
                                const sec = document.getElementById('uploadFormSection');
                                if (sec) sec.style.display = 'block';
                              }}
                            >
                              <i className="fa fa-video me-2 fs-5"></i> <span className="fs-6">Upload Video Recording</span>
                            </button>
                            <button 
                              className="btn-premium btn-primary-theme px-4 py-3"
                              onClick={() => {
                                setFolderType('Presentations');
                                const sec = document.getElementById('uploadFormSection');
                                if (sec) sec.style.display = 'block';
                              }}
                            >
                              <i className="fa fa-file-powerpoint me-2 fs-5"></i> <span className="fs-6">Upload Presentation</span>
                            </button>
                            <button 
                              className="btn-premium btn-accent-theme px-4 py-3"
                              onClick={() => {
                                setFolderType('Additional Study Material');
                                const sec = document.getElementById('uploadFormSection');
                                if (sec) sec.style.display = 'block';
                              }}
                            >
                              <i className="fa fa-book me-2 fs-5"></i> <span className="fs-6">Upload Study Material</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Upload Form (Hidden by default) */}
                      <div id="uploadFormSection" className="card-premium mb-4" style={{ display: 'none' }}>
                        <div className="card-header bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                          <h5 className="heading-premium mb-0 text-primary">
                            <i className="fa fa-upload me-2"></i>Publish Material to {selectedBatch.batchName}
                          </h5>
                          <button className="btn-close" onClick={() => {
                            const sec = document.getElementById('uploadFormSection');
                            if (sec) sec.style.display = 'none';
                          }}></button>
                        </div>
                        <div className="card-body p-4">
                          <form onSubmit={handleUpload}>
                            <div className="row g-3">
                              <div className="col-md-4">
                                <label className="form-label fw-bold text-muted small">Content Title <span className="text-danger">*</span></label>
                                <input 
                                  type="text" 
                                  className="input-premium bg-light" 
                                  required 
                                  value={title} 
                                  onChange={(e)=>setTitle(e.target.value)} 
                                  placeholder="e.g. Session 1 - Orientation" 
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label fw-bold text-muted small">Module Name</label>
                                <input 
                                  type="text" 
                                  className="input-premium bg-white" 
                                  value={moduleName} 
                                  onChange={(e)=>setModuleName(e.target.value)}
                                  placeholder="e.g. Clinical Research / General" 
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label fw-bold text-muted small">Content Category</label>
                                <select 
                                  className="form-select input-premium bg-white"
                                  value={folderType}
                                  onChange={(e) => setFolderType(e.target.value)}
                                >
                                  <option value="Recorded Sessions">Recorded Sessions (Video)</option>
                                  <option value="Presentations">Presentations (PPT/PDF)</option>
                                  <option value="Additional Study Material">Additional Study Material</option>
                                  <option value="Question Bank">Question Bank</option>
                                </select>
                              </div>

                              {/* YouTube or File Upload Selector for Video Recordings */}
                              {folderType === 'Recorded Sessions' ? (
                                <div className="col-12">
                                  <div className="p-3 bg-light rounded-3 border">
                                    <label className="form-label fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                                      <i className="fa fa-youtube text-danger fs-5"></i>
                                      <span>YouTube Video URL (Public, Unlisted, or Private Embed)</span>
                                    </label>
                                    <input 
                                      type="url" 
                                      className="input-premium bg-white mb-2" 
                                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                                      value={youtubeUrl}
                                      onChange={(e) => setYoutubeUrl(e.target.value)}
                                    />
                                    <div className="text-center text-muted fw-bold small my-2">-- OR Select Video File --</div>
                                    <input 
                                      type="file" 
                                      className="input-premium bg-white" 
                                      accept="video/*" 
                                      onChange={(e)=>setFile(e.target.files[0])} 
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="col-12">
                                  <label className="form-label fw-bold text-muted small">Select File (PDF, PPT, Word Doc) <span className="text-danger">*</span></label>
                                  <input 
                                    type="file" 
                                    className="input-premium bg-white" 
                                    required={!file} 
                                    onChange={(e)=>setFile(e.target.files[0])} 
                                    accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx" 
                                  />
                                </div>
                              )}

                              <div className="col-12">
                                <label className="form-label fw-bold text-muted small">Description (Optional)</label>
                                <textarea 
                                  className="input-premium bg-light" 
                                  rows="2" 
                                  value={description} 
                                  onChange={(e)=>setDescription(e.target.value)}
                                  placeholder="Brief overview or notes for students..."
                                />
                              </div>

                              <div className="col-12 mt-3 text-end border-top pt-3">
                                <button type="submit" className="btn-premium btn-primary-theme px-5" disabled={uploading}>
                                  {uploading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span> Publishing...</>
                                  ) : (
                                    <><i className="fa fa-upload me-2"></i> Publish to LMS</>
                                  )}
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* Search & Category Filter Controls */}
                      <div className="card-premium mb-4 bg-white border p-3">
                        <div className="row g-2 align-items-center">
                          <div className="col-md-6">
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0"><i className="fa fa-search text-muted"></i></span>
                              <input 
                                type="text" 
                                className="form-control border-start-0 bg-light" 
                                placeholder="Search materials by title or module..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                              {searchQuery && (
                                <button className="btn btn-light border border-start-0" onClick={() => setSearchQuery('')}>
                                  <i className="fa fa-times text-muted"></i>
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex flex-wrap gap-1 justify-content-md-end">
                              <button 
                                className={`btn btn-sm rounded-pill px-3 fw-bold ${filterCategory === 'all' ? 'btn-primary' : 'btn-light border text-muted'}`}
                                onClick={() => setFilterCategory('all')}
                              >
                                All ({contents.length})
                              </button>
                              <button 
                                className={`btn btn-sm rounded-pill px-3 fw-bold ${filterCategory === 'video' ? 'btn-danger' : 'btn-light border text-muted'}`}
                                onClick={() => setFilterCategory('video')}
                              >
                                Videos ({contents.filter(c => c.contentType === 'video').length})
                              </button>
                              <button 
                                className={`btn btn-sm rounded-pill px-3 fw-bold ${filterCategory === 'doc' ? 'btn-success' : 'btn-light border text-muted'}`}
                                onClick={() => setFilterCategory('doc')}
                              >
                                Documents ({contents.filter(c => c.contentType !== 'video').length})
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Uploaded Content List */}
                      <div className="card-premium">
                        <div className="card-header bg-white border-0 pt-4 pb-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                          <h5 className="heading-premium mb-0"><i className="fa fa-folder-open text-warning me-2"></i>Batch Materials & Recordings</h5>
                          <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                            Showing {contents.filter(c => {
                              const matchSearch = (c.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (c.moduleName?.toLowerCase() || '').includes(searchQuery.toLowerCase());
                              const matchType = filterCategory === 'all' ? true : filterCategory === 'video' ? c.contentType === 'video' : c.contentType !== 'video';
                              return matchSearch && matchType;
                            }).length} items
                          </span>
                        </div>
                        <div className="card-body p-0">
                          {contents.length === 0 ? (
                            <div className="text-center py-5">
                              <i className="fa fa-box-open fs-1 text-muted opacity-25 mb-3"></i>
                              <p className="text-muted fs-5 mb-0">No materials have been uploaded for this batch yet.</p>
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th className="ps-4 py-3">Module</th>
                                    <th className="py-3">Title</th>
                                    <th className="py-3">Type</th>
                                    <th className="py-3">Date Added</th>
                                    <th className="text-end pe-4 py-3">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {contents
                                    .filter(content => {
                                      const matchSearch = (content.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (content.moduleName?.toLowerCase() || '').includes(searchQuery.toLowerCase());
                                      const matchType = filterCategory === 'all' ? true : filterCategory === 'video' ? content.contentType === 'video' : content.contentType !== 'video';
                                      return matchSearch && matchType;
                                    })
                                    .map(content => (
                                    <tr key={content.id}>
                                      <td className="ps-4">
                                        {editingId === content.id ? (
                                          <input type="text" className="form-control form-control-sm" value={editModule} onChange={e => setEditModule(e.target.value)} />
                                        ) : (
                                          <span className="badge bg-secondary rounded-pill px-3 py-2">{content.moduleName}</span>
                                        )}
                                      </td>
                                      <td className="fw-bold">
                                        {editingId === content.id ? (
                                          <input type="text" className="form-control form-control-sm" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                        ) : (
                                          <div>
                                            <span className="text-dark d-block">{content.title}</span>
                                            {content.description && <small className="text-muted fw-normal d-block">{content.description}</small>}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center gap-2">
                                          <i className={`fa ${getIcon(content.contentType)} fs-5`}></i>
                                          <span className="small text-muted text-capitalize">{content.category || content.contentType}</span>
                                        </div>
                                      </td>
                                      <td className="text-muted small">{new Date(content.createdAt).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</td>
                                      <td className="text-end pe-4">
                                        {editingId === content.id ? (
                                          <div className="d-flex justify-content-end gap-1">
                                            <button className="btn btn-sm btn-success rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => handleEditSave(content.id)} title="Save">
                                              <i className="fa fa-check"></i>
                                            </button>
                                            <button className="btn btn-sm btn-secondary rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => setEditingId(null)} title="Cancel">
                                              <i className="fa fa-times"></i>
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="d-flex justify-content-end gap-1">
                                            {/* Watch / Preview Button */}
                                            <button 
                                              className="btn btn-sm btn-primary rounded-pill px-3 d-flex align-items-center gap-1 shadow-sm"
                                              onClick={() => setPreviewModalContent(content)}
                                              title={content.contentType === 'video' ? "Watch Recording" : "Preview Material"}
                                            >
                                              <i className={`fa ${content.contentType === 'video' ? 'fa-play' : 'fa-eye'}`}></i>
                                              <span>{content.contentType === 'video' ? 'Watch' : 'View'}</span>
                                            </button>

                                            <button className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => { setEditingId(content.id); setEditTitle(content.title); setEditModule(content.moduleName); }} title="Edit Name">
                                              <i className="fa fa-pen"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => handleDelete(content.id)} title="Delete File">
                                              <i className="fa fa-trash"></i>
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Modal for In-Page Video Playback / Preview */}
                      {previewModalContent && (
                        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1060 }} tabIndex="-1">
                          <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                              <div className="modal-header bg-dark text-white border-0 py-3 px-4">
                                <div className="d-flex align-items-center gap-2">
                                  <i className={`fa ${previewModalContent.contentType === 'video' ? 'fa-play-circle text-danger' : 'fa-file-text text-info'} fs-4`}></i>
                                  <h5 className="modal-title fw-bold mb-0 text-white">{previewModalContent.title}</h5>
                                </div>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewModalContent(null)}></button>
                              </div>
                              <div className="modal-body p-0 bg-black text-center" style={{ minHeight: '400px' }}>
                                {previewModalContent.contentType === 'video' ? (
                                  <div className="ratio ratio-16x9">
                                    {previewModalContent.driveWebViewLink && (previewModalContent.driveWebViewLink.includes('youtube.com') || previewModalContent.driveWebViewLink.includes('youtu.be')) ? (
                                      <iframe 
                                        src={previewModalContent.driveWebViewLink} 
                                        title={previewModalContent.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        style={{ border: 0 }}
                                      />
                                    ) : (
                                      <video 
                                        src={previewModalContent.localFileUrl || previewModalContent.driveWebViewLink} 
                                        controls 
                                        controlsList="nodownload"
                                        className="w-100 h-100"
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <div className="p-5 text-white bg-dark">
                                    <i className="fa fa-file-text fs-1 text-primary opacity-50 mb-3 d-block"></i>
                                    <h5>{previewModalContent.title}</h5>
                                    <p className="text-white-50">{previewModalContent.description || 'Uploaded study document.'}</p>
                                    {previewModalContent.driveWebViewLink || previewModalContent.localFileUrl ? (
                                      <a 
                                        href={previewModalContent.driveWebViewLink || previewModalContent.localFileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-primary px-4 py-2 rounded-pill fw-bold"
                                      >
                                        <i className="fa fa-external-link-alt me-2"></i> Open File in New Tab
                                      </a>
                                    ) : (
                                      <p className="text-warning">No file link available for preview.</p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="modal-footer bg-light border-0 py-2 px-4 d-flex justify-content-between">
                                <span className="small text-muted">
                                  Module: <strong>{previewModalContent.moduleName}</strong>
                                </span>
                                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setPreviewModalContent(null)}>
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Live Sessions Manager */}
                      <div className="card-premium mb-4 bg-light">
                        <div className="card-body p-4 text-center">
                          <h4 className="heading-premium mb-4">Live Session Management</h4>
                          <div className="d-flex flex-column flex-sm-row flex-wrap justify-content-center gap-3">
                             <button className="btn-premium btn-primary-theme px-4 py-3" onClick={() => setShowScheduleForm(!showScheduleForm)}>
                              <i className="fa fa-calendar-plus me-2 fs-5"></i> <span className="fs-6">Schedule Session(s)</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Form */}
                      {showScheduleForm && (
                        <div className="card-premium mb-4">
                          <div className="card-header bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                            <h5 className="heading-premium mb-0 text-primary">
                              {isEditingSession ? 'Edit Scheduled Session' : 'Schedule New Session(s)'}
                            </h5>
                            <button className="btn-close" onClick={() => {
                              setShowScheduleForm(false);
                              setIsEditingSession(false);
                              setEditingSessionId(null);
                              setScheduleData({
                                title: '', sessionTime: '', startDate: '', endDate: '', isRecurring: false, recurrenceType: 'daily'
                              });
                            }}></button>
                          </div>
                          <div className="card-body p-4">
                            <form onSubmit={handleScheduleSubmit}>
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label className="form-label">Meeting Name/Title (Optional)</label>
                                  <input type="text" className="input-premium" value={scheduleData.title} onChange={e=>setScheduleData({...scheduleData, title: e.target.value})} placeholder="e.g. Clinical Research Live Daily Class" />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">Start Date *</label>
                                  <input type="date" className="input-premium" required value={scheduleData.startDate} onChange={e=>setScheduleData({...scheduleData, startDate: e.target.value})} />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">Time *</label>
                                  <input type="time" className="input-premium" required value={scheduleData.sessionTime} onChange={e=>setScheduleData({...scheduleData, sessionTime: e.target.value})} />
                                </div>
                                <div className="col-12 mt-3">
                                  <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" checked={scheduleData.isRecurring} onChange={e=>setScheduleData({...scheduleData, isRecurring: e.target.checked})} id="recurrenceSwitch" />
                                    <label className="form-check-label fw-bold" htmlFor="recurrenceSwitch">Make this a recurring session</label>
                                  </div>
                                </div>
                                {scheduleData.isRecurring && (
                                  <>
                                    <div className="col-md-6 mt-3">
                                      <label className="form-label">Recurrence Pattern</label>
                                      <select className="input-premium" value={scheduleData.recurrenceType} onChange={e=>setScheduleData({...scheduleData, recurrenceType: e.target.value})}>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                      </select>
                                    </div>
                                    <div className="col-md-6 mt-3">
                                      <label className="form-label">End Date *</label>
                                      <input type="date" className="input-premium" required={scheduleData.isRecurring} value={scheduleData.endDate} onChange={e=>setScheduleData({...scheduleData, endDate: e.target.value})} />
                                    </div>
                                  </>
                                )}
                                <div className="col-12 mt-4 text-end">
                                  <button type="submit" className="btn-premium btn-primary-theme px-5">
                                    {isEditingSession ? 'Update Session' : 'Schedule Now'}
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}

                      {/* Sessions List */}
                      <div className="card-premium">
                        <div className="card-header bg-white border-0 pt-4 pb-3" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                          <h5 className="heading-premium mb-0"><i className="fa fa-calendar-check text-warning me-2"></i>Upcoming & Live Sessions</h5>
                        </div>
                        <div className="card-body p-0">
                          {liveSessions.length === 0 ? (
                            <div className="text-center py-5">
                              <i className="fa fa-calendar-times fs-1 text-muted opacity-25 mb-3"></i>
                              <p className="text-muted fs-5 mb-0">No upcoming sessions scheduled.</p>
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th className="ps-4 py-3">Date</th>
                                    <th className="py-3">Time</th>
                                    <th className="py-3">Title</th>
                                    <th className="py-3">Status</th>
                                    <th className="text-end pe-4 py-3">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {liveSessions.map(session => (
                                    <tr key={session.id}>
                                      <td className="ps-4 text-muted fw-bold">{new Date(session.sessionDate).toLocaleDateString()}</td>
                                      <td className="fw-bold">{session.sessionTime}</td>
                                      <td>{session.title}</td>
                                      <td>
                                        {session.status === 'live' ? (
                                          <span className="badge bg-danger rounded-pill px-3 py-2 heartbeat">Live Now</span>
                                        ) : session.status === 'completed' ? (
                                          <span className="badge bg-secondary rounded-pill px-3 py-2">Completed</span>
                                        ) : (
                                          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 border border-primary border-opacity-25">Upcoming</span>
                                        )}
                                      </td>
                                      <td className="text-end pe-4">
                                        {session.status === 'upcoming' && (
                                          <button onClick={() => handleGoLive(session.id)} className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm" title="Notify Students & Go Live">
                                            Go Live <i className="fa fa-broadcast-tower ms-1"></i>
                                          </button>
                                        )}
                                        {session.status === 'live' && (
                                          <a href={`https://jitsi.belnet.be/Clinidea_LiveClass_Batch_${selectedBatch.id}_${session.id}#userInfo.displayName="${encodeURIComponent('Mentor / Instructor')}"&config.prejoinPageEnabled=false`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-success rounded-pill px-3 shadow-sm" title="Re-join Jitsi Room">
                                            Enter Jitsi <i className="fa fa-external-link-alt ms-1"></i>
                                          </a>
                                        )}
                                        <button 
                                          onClick={() => handleEditSessionStart(session)} 
                                          className="btn btn-sm btn-outline-primary rounded-pill px-3 ms-2 shadow-sm" 
                                          title="Edit Session"
                                        >
                                          Edit <i className="fa fa-edit"></i>
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteSession(session.id)} 
                                          className="btn btn-sm btn-outline-danger rounded-pill px-3 ms-2 shadow-sm" 
                                          title="Delete Session"
                                        >
                                          <i className="fa fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>

                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default AdminLMS;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';
import * as XLSX from 'xlsx';

const AdminBatches = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeBatch, setActiveBatch] = useState(null);
  const [batchMaterials, setBatchMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [batchActiveTab, setBatchActiveTab] = useState('materials');
  const [previewModalContent, setPreviewModalContent] = useState(null);

  // Form Model
  const [formData, setFormData] = useState({
    courseId: '',
    batchName: '',
    startDate: '',
    endDate: '',
    classTime: ''
  });

  useEffect(() => {
    fetchCoreData();
  }, [navigate]);

  const fetchCoreData = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/admin/login');
    
    // Async pull both arrays concurrently
    const bUrl = `${BASE_URL}/api/admin/batches`;
    const cUrl = `${BASE_URL}/api/courses`;
    const mUrl = `${BASE_URL}/api/admin/mentors`;
    const eUrl = `${BASE_URL}/api/admin/enrollments`;
    const uUrl = `${BASE_URL}/api/admin/users`;

    Promise.all([
      fetch(bUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch(cUrl),
      fetch(mUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch(eUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch(uUrl, { headers: { 'Authorization': `Bearer ${token}` } })
    ])
    .then(async ([bRes, cRes, mRes, eRes, uRes]) => {
      if(bRes.ok) setBatches(await bRes.json());
      if(cRes.ok) setCourses(await cRes.json());
      if(mRes.ok) setMentors(await mRes.json());
      if(eRes.ok) setEnrollments(await eRes.json());
      if(uRes.ok) setUsers(await uRes.json());
      setLoading(false);
    })
    .catch(err => console.error("Fault loading active arrays."));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitBatchForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    const url = `${BASE_URL}/api/admin/batches`;
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Server rejected batch allocation.");
      
      setFormData({ courseId: '', batchName: '', startDate: '', endDate: '', classTime: '' });
      setShowForm(false);
      fetchCoreData();
    } catch (err) {
      alert(`API Fault: ${err.message}`);
    }
    setSubmitting(false);
  };

  const deleteBatch = async (id) => {
    if(!window.confirm("Purge batch instance? This will orphan all associated students!")) return;
    const token = localStorage.getItem('adminToken');
    const url = `${BASE_URL}/api/admin/batches/${id}`;
    
    try {
      const res = await fetch(url, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if(!res.ok) throw new Error("Purge Failed.");
      fetchCoreData();
    } catch(err) {
      alert(err.message);
    }
  };

  const fetchBatchMaterials = async (batchId) => {
    setLoadingMaterials(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/batches/${batchId}/content`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBatchMaterials(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load batch materials", err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleDeleteBatchMaterial = async (contentId) => {
    if (!window.confirm("Are you sure you want to delete this material permanently?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/content/${contentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Material deleted successfully.");
        if (activeBatch) fetchBatchMaterials(activeBatch.id);
      } else {
        alert("Failed to delete material.");
      }
    } catch (err) {
      alert("Error deleting material.");
    }
  };

  const viewStudents = (batchObj) => {
    setActiveBatch(batchObj);
    fetchBatchMaterials(batchObj.id);
  };

  const getRelevantMentors = (courseName) => {
    return mentors;
  };

  const handleAssignMentor = async (batchId, mentorId, moduleName) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/batches/${batchId}/mentors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mentorId, moduleName })
      });
      if (res.ok) {
        alert("Mentor assigned to batch successfully!");
        fetchCoreData();
        // Update active batch to reflect new mentors
        const updatedBatchRes = await fetch(`${BASE_URL}/api/admin/batches`, { headers: { 'Authorization': `Bearer ${token}` } });
        if(updatedBatchRes.ok) {
           const updatedBatches = await updatedBatchRes.json();
           const newActive = updatedBatches.find(b => b.id === batchId);
           if(newActive) setActiveBatch(newActive);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to assign mentor");
      }
    } catch (err) {
      console.error('Failed to assign mentor');
    }
  };

  const handleInitDrive = async (batchId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/batches/${batchId}/init-drive`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Google Drive folder initialized successfully!');
        const updatedBatch = await res.json();
        setBatches(batches.map(b => b.id === batchId ? updatedBatch : b));
        if (activeBatch && activeBatch.id === batchId) {
          setActiveBatch(updatedBatch);
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to initialize Drive folder');
      }
    } catch (err) {
      console.error('Failed to initialize drive');
    }
  };

  const handleAssignStudent = async (selectedValue, batchId) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (typeof selectedValue === 'string' && selectedValue.startsWith('user_')) {
        // Create new enrollment for registered user
        const userId = selectedValue.split('_')[1];
        const res = await fetch(`${BASE_URL}/api/admin/enrollments/create-for-registered`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId, batchId: parseInt(batchId), courseName: activeBatch.course?.name })
        });
        if (res.ok) {
          fetchCoreData();
        } else {
          alert('Failed to assign registered student');
        }
      } else {
        // Update existing enrollment
        const res = await fetch(`${BASE_URL}/api/admin/enrollments/${selectedValue}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ batchId: batchId ? parseInt(batchId) : null })
        });
        if (res.ok) {
          fetchCoreData();
        } else {
          alert('Failed to re-assign student');
        }
      }
    } catch (err) {
      console.error('Failed to assign student');
    }
  };

  const handleUpdateBatchDates = async (batchId, actionType) => {
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {};
      const today = new Date().toISOString();
      if (actionType === 'start') {
        payload.startDate = today;
      } else if (actionType === 'end') {
        payload.endDate = today;
      }
      
      const res = await fetch(`${BASE_URL}/api/admin/batches/${batchId}/dates`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(`Batch ${actionType === 'start' ? 'started' : 'ended'} successfully!`);
        fetchCoreData();
        const updatedBatchRes = await fetch(`${BASE_URL}/api/admin/batches`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (updatedBatchRes.ok) {
           const updatedBatches = await updatedBatchRes.json();
           const newActive = updatedBatches.find(b => b.id === batchId);
           if (newActive) setActiveBatch(newActive);
        }
      } else {
        alert('Failed to update batch status');
      }
    } catch (err) {
      console.error('Failed to update batch dates', err);
    }
  };

  const handleUpdateStudentCredentials = async (userId, currentEmail) => {
    const newEmail = window.prompt("Enter new Login ID (Email) for this student:", currentEmail);
    if (newEmail === null) return;
    
    const newPassword = window.prompt("Enter new Password for this student (min 6 chars):");
    if (newPassword === null) return;

    if (newPassword && newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail: newEmail || undefined, newPassword: newPassword || undefined })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("Student credentials updated successfully!");
        fetchCoreData();
      } else {
        alert(data.error || "Failed to update credentials");
      }
    } catch (err) {
      console.error("Failed to update credentials", err);
      alert("Error updating credentials");
    }
  };

  const exportToExcel = () => {
    if (!activeBatch) return;

    const batchStudents = enrollments.filter(e => e.batchId === activeBatch.id);
    if (batchStudents.length === 0) {
      alert("No students are enrolled in this batch yet.");
      return;
    }

    const dataToExport = batchStudents.map((enr, index) => ({
      'Sr. No.': index + 1,
      'Student Name': enr.user?.fullName || 'N/A',
      'Email ID': enr.user?.email || 'N/A',
      'Phone Number': enr.user?.phone || 'N/A',
      'Registered Course': enr.user?.registeredCourse || enr.courseName || 'N/A',
      'Batch Name': activeBatch.batchName || 'N/A',
      'Enrolled Date': enr.createdAt ? new Date(enr.createdAt).toLocaleDateString() : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Batch Students");
    
    // Auto-adjust column widths
    const maxWidths = dataToExport.reduce((acc, row) => {
      Object.keys(row).forEach(key => {
        const val = row[key] ? row[key].toString() : '';
        acc[key] = Math.max(acc[key] || key.length, val.length);
      });
      return acc;
    }, {});
    worksheet['!cols'] = Object.keys(maxWidths).map(key => ({ wch: maxWidths[key] + 2 }));

    XLSX.writeFile(workbook, `${activeBatch.batchName.replace(/[^a-z0-9]/gi, '_')}_Students.xlsx`);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <div>
              <h2 className="fw-bold m-0" style={{ color: 'var(--color-primary)' }}>Batch Management Vector</h2>
              <p className="text-muted mb-0 mt-1">Cross-reference courses and deploy scheduling pipelines</p>
            </div>
          </div>
          {!showForm && !activeBatch && (
            <button className="btn btn-dark fw-bold px-4 shadow-sm" style={{ borderRadius: '8px' }} onClick={() => setShowForm(true)}>
              <i className="fa fa-layer-group me-2"></i> Instantiate Batch
            </button>
          )}
        </div>

        {activeBatch ? (
          <div className="active-batch-view slide-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0"><i className="fa fa-layer-group me-2 text-primary"></i> {activeBatch.batchName} Control Center</h3>
              <div className="d-flex gap-2">
                <button onClick={exportToExcel} className="btn btn-success fw-bold shadow-sm d-flex align-items-center">
                  <i className="fa fa-file-excel me-2"></i> Export Excel
                </button>
                <a href={`${BASE_URL}/api/admin/batches/${activeBatch.id}/download-all`} target="_blank" rel="noopener noreferrer" className="btn btn-primary fw-bold shadow-sm d-flex align-items-center">
                  <i className="fa fa-file-archive me-2"></i> Download All (ZIP)
                </a>
                <button className="btn btn-outline-dark fw-bold d-flex align-items-center" onClick={() => setActiveBatch(null)}>
                  <i className="fa fa-arrow-left me-2"></i> Return to Registry
                </button>
              </div>
            </div>

            {/* Batch Navigation Tabs */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <button 
                className={`btn fw-bold px-4 py-2 rounded-pill shadow-sm ${batchActiveTab === 'materials' ? 'btn-primary' : 'btn-light border'}`}
                onClick={() => setBatchActiveTab('materials')}
              >
                <i className="fa fa-folder-open me-2 text-warning"></i>
                Study Materials & Videos
                <span className={`badge ms-2 rounded-pill ${batchActiveTab === 'materials' ? 'bg-white text-primary' : 'bg-secondary'}`}>
                  {batchMaterials.length}
                </span>
              </button>
              <button 
                className={`btn fw-bold px-4 py-2 rounded-pill shadow-sm ${batchActiveTab === 'students' ? 'btn-primary' : 'btn-light border'}`}
                onClick={() => setBatchActiveTab('students')}
              >
                <i className="fa fa-users me-2"></i>
                Student Roster
                <span className={`badge ms-2 rounded-pill ${batchActiveTab === 'students' ? 'bg-white text-primary' : 'bg-secondary'}`}>
                  {enrollments.filter(e => e.batchId === activeBatch.id).length}
                </span>
              </button>
              <button 
                className={`btn fw-bold px-4 py-2 rounded-pill shadow-sm ${batchActiveTab === 'mentors' ? 'btn-primary' : 'btn-light border'}`}
                onClick={() => setBatchActiveTab('mentors')}
              >
                <i className="fa fa-chalkboard-teacher me-2"></i>
                Module Mentors & Settings
                <span className={`badge ms-2 rounded-pill ${batchActiveTab === 'mentors' ? 'bg-white text-primary' : 'bg-secondary'}`}>
                  {activeBatch.batchMentors?.length || 0}
                </span>
              </button>
            </div>

            {/* TAB 1: STUDY MATERIALS & VIDEOS */}
            {batchActiveTab === 'materials' && (
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4 pb-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <h5 className="fw-bold mb-1"><i className="fa fa-photo-video text-warning me-2"></i>Batch Study Materials & Recordings</h5>
                    <small className="text-muted">All video recordings, presentations, and documents uploaded for {activeBatch.batchName}</small>
                  </div>
                  <button 
                    className="btn btn-outline-primary fw-bold rounded-pill px-4 shadow-sm"
                    onClick={() => navigate('/admin/lms')}
                  >
                    <i className="fa fa-plus-circle me-1"></i> Upload More in LMS Control Center
                  </button>
                </div>
                <div className="card-body p-0">
                  {loadingMaterials ? (
                    <div className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      <span className="text-muted">Loading materials...</span>
                    </div>
                  ) : batchMaterials.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fa fa-box-open fs-1 text-muted opacity-25 mb-3 d-block"></i>
                      <p className="text-muted fs-5 mb-2">No materials uploaded for this batch yet.</p>
                      <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => navigate('/admin/lms')}>
                        Go to LMS Upload Center
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="px-4 py-3">Module</th>
                            <th className="py-3">Title & Description</th>
                            <th className="py-3">Type</th>
                            <th className="py-3">Date Added</th>
                            <th className="text-end px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batchMaterials.map(mat => (
                            <tr key={mat.id}>
                              <td className="px-4">
                                <span className="badge bg-secondary rounded-pill px-3 py-2">{mat.moduleName || 'General'}</span>
                              </td>
                              <td className="fw-bold">
                                <span className="text-dark d-block">{mat.title}</span>
                                {mat.description && <small className="text-muted fw-normal d-block">{mat.description}</small>}
                              </td>
                              <td>
                                <span className="badge bg-light text-dark border px-2 py-1 text-capitalize">
                                  <i className={`fa ${mat.contentType === 'video' ? 'fa-video text-danger' : 'fa-file text-primary'} me-1`}></i>
                                  {mat.category || mat.contentType}
                                </span>
                              </td>
                              <td className="text-muted small">{new Date(mat.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                              <td className="text-end px-4">
                                <div className="d-flex justify-content-end gap-2">
                                  <button 
                                    className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm"
                                    onClick={() => setPreviewModalContent(mat)}
                                    title={mat.contentType === 'video' ? "Watch Recording" : "View Document"}
                                  >
                                    <i className={`fa ${mat.contentType === 'video' ? 'fa-play' : 'fa-eye'} me-1`}></i>
                                    <span>{mat.contentType === 'video' ? 'Watch' : 'View'}</span>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger rounded-circle"
                                    style={{ width: '34px', height: '34px' }}
                                    onClick={() => handleDeleteBatchMaterial(mat.id)}
                                    title="Delete Material"
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: STUDENT ROSTER */}
            {batchActiveTab === 'students' && (
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Student Roster ({enrollments.filter(e => e.batchId === activeBatch.id).length})</h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="px-4 py-3">Student File</th>
                          <th className="py-3">Login ID (Email)</th>
                          <th className="text-end px-4 py-3">Controls</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.filter(e => e.batchId === activeBatch.id).map(enr => (
                          <tr key={enr.id}>
                            <td className="px-4 fw-bold text-dark">{enr.user?.fullName}</td>
                            <td className="text-muted">{enr.user?.email}</td>
                            <td className="text-end px-4">
                              <div className="d-flex justify-content-end gap-2">
                                <button 
                                  className="btn btn-sm btn-outline-primary" 
                                  onClick={() => handleUpdateStudentCredentials(enr.userId, enr.user?.email)}
                                  title="Edit Login ID & Password"
                                >
                                  <i className="fa fa-key"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger" 
                                  onClick={() => handleAssignStudent(enr.id, null)}
                                  title="Remove from Batch"
                                >
                                  <i className="fa fa-trash-alt"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Add Student Row */}
                        <tr className="bg-light">
                          <td colSpan="3" className="px-4 py-3">
                            <div className="d-flex gap-2">
                              <select className="form-select form-select-sm" id="newStudentSelect" style={{ maxWidth: '350px' }}>
                                <option value="">-- Add Student to Batch --</option>
                                {enrollments.filter(e => {
                                  if (e.batchId !== null) return false;
                                  const activeCName = activeBatch.course?.name || '';
                                  const studentCName = e.courseName || '';
                                  const isMixed = (name) => {
                                    const l = name.toLowerCase();
                                    return l.includes('clinical research') || l.includes('pharmacovigilance') || l.includes('data management');
                                  };
                                  if (isMixed(activeCName) && isMixed(studentCName)) return true;
                                  return studentCName === activeCName;
                                }).map(enr => (
                                  <option key={enr.id} value={enr.id}>
                                    {enr.user?.fullName} (Enrolled)
                                  </option>
                                ))}
                                {users.filter(u => {
                                  const activeCName = activeBatch.course?.name || '';
                                  const userCName = u.registeredCourse || '';
                                  const isMixed = (name) => {
                                    const l = name.toLowerCase();
                                    return l.includes('clinical research') || l.includes('pharmacovigilance') || l.includes('data management');
                                  };
                                  
                                  const matchesCourse = isMixed(activeCName) && isMixed(userCName) ? true : userCName === activeCName;
                                  const alreadyEnrolled = enrollments.some(e => e.userId === u.id && e.courseName === userCName);
                                  
                                  return matchesCourse && !alreadyEnrolled;
                                }).map(u => (
                                  <option key={`user_${u.id}`} value={`user_${u.id}`}>
                                    {u.fullName} (Registered - Pending Fee)
                                  </option>
                                ))}
                              </select>
                              <button 
                                className="btn btn-sm btn-dark fw-bold px-3"
                                onClick={() => {
                                  const sel = document.getElementById('newStudentSelect');
                                  if(sel.value) {
                                    handleAssignStudent(sel.value, activeBatch.id);
                                    sel.value = '';
                                  }
                                }}
                              >
                                Add Student
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MODULE MENTORS & SETTINGS */}
            {batchActiveTab === 'mentors' && (
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4 pb-2">
                  <h5 className="fw-bold mb-0">Module Mentors & Batch Lifecycle</h5>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded-3 border h-100">
                        <h6 className="fw-bold mb-2">Batch Lifecycle Management</h6>
                        {!activeBatch.startDate ? (
                          <button 
                            className="btn btn-primary btn-sm fw-bold w-100" 
                            onClick={() => handleUpdateBatchDates(activeBatch.id, 'start')}
                          >
                            <i className="fa fa-play me-2"></i> Start Batch
                          </button>
                        ) : (
                          <div>
                            <p className="mb-2 text-success fw-bold">
                              <i className="fa fa-clock me-2"></i> Started on: {new Date(activeBatch.startDate).toLocaleDateString()}
                            </p>
                            {new Date() >= new Date(new Date(activeBatch.startDate).setMonth(new Date(activeBatch.startDate).getMonth() + 6)) ? (
                              !activeBatch.endDate ? (
                                <button 
                                  className="btn btn-danger btn-sm fw-bold w-100" 
                                  onClick={() => handleUpdateBatchDates(activeBatch.id, 'end')}
                                >
                                  <i className="fa fa-stop me-2"></i> End Batch
                                </button>
                              ) : (
                                <p className="mb-0 text-danger fw-bold">
                                  <i className="fa fa-check-double me-2"></i> Ended on: {new Date(activeBatch.endDate).toLocaleDateString()}
                                </p>
                              )
                            ) : (
                              <p className="small text-muted mb-0"><i className="fa fa-lock me-1"></i> End option unlocks 6 months post-start.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded-3 border h-100">
                        <h6 className="fw-bold mb-3 border-bottom pb-2">Assign Mentor to Module</h6>
                        <div className="d-flex flex-column gap-2 mb-3">
                          <select className="form-select form-select-sm" id="mentorSelect">
                            <option value="">-- Select Mentor --</option>
                            {getRelevantMentors(activeBatch?.course?.name).map(m => <option key={m.id} value={m.id}>{m.email}</option>)}
                          </select>
                          <input type="text" className="form-control form-control-sm" id="moduleName" placeholder="Module (e.g. Clinical Research)" />
                          <button 
                            className="btn btn-primary btn-sm fw-bold"
                            onClick={async () => {
                              const mSel = document.getElementById('mentorSelect');
                              const modName = document.getElementById('moduleName');
                              if(!mSel.value || !modName.value) { alert("Select mentor and module name"); return; }
                              await handleAssignMentor(activeBatch.id, parseInt(mSel.value), modName.value);
                              mSel.value = '';
                              modName.value = '';
                            }}
                          >
                            <i className="fa fa-plus me-1"></i> Add Mentor to Module
                          </button>
                        </div>

                        <div className="small">
                          <strong className="d-block mb-2 text-muted">Assigned Mentors:</strong>
                          <ul className="list-group list-group-flush border rounded-3">
                            {activeBatch.batchMentors?.length > 0 ? activeBatch.batchMentors.map(bm => (
                              <li key={bm.id} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3 bg-white">
                                <div>
                                  <span className="fw-bold d-block text-dark">{bm.moduleName}</span>
                                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>Mentor: {bm.mentor?.email || `ID: ${bm.mentorId}`}</span>
                                </div>
                                <i className="fa fa-chalkboard-teacher text-primary opacity-50"></i>
                              </li>
                            )) : <li className="list-group-item text-muted text-center py-2 bg-white">No mentors assigned.</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* In-Batch Preview Modal */}
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
                        Module: <strong>{previewModalContent.moduleName || 'General'}</strong>
                      </span>
                      <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setPreviewModalContent(null)}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : showForm ? (
          <div className="card shadow-sm border-0 rounded-4 mb-4 slide-in">
            <div className="card-body p-4 p-md-5">
              <h4 className="fw-bold mb-4 text-dark border-bottom pb-3">Construct Allocation Array</h4>
              <form onSubmit={submitBatchForm}>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Select Active Course <span className="text-danger">*</span></label>
                    <select className="form-select form-select-lg bg-light fw-bold" name="courseId" value={formData.courseId} onChange={handleInputChange} required>
                      <option value="">-- Awaiting Selection --</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Sub-Batch Alias <span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-lg bg-light" name="batchName" placeholder="e.g. CRPV Morning Alpha" value={formData.batchName} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-4">
                     <label className="form-label fw-bold">Launch Configuration (Start)</label>
                     <input type="date" className="form-control bg-light" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                     <label className="form-label fw-bold">Termination Condition (End)</label>
                     <input type="date" className="form-control bg-light" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                     <label className="form-label fw-bold">Daily Time Matrix</label>
                     <input type="text" className="form-control bg-light" name="classTime" placeholder="e.g. 10:00 AM - 1:00 PM" value={formData.classTime} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-end border-top pt-4">
                   <button type="button" className="btn btn-outline-secondary px-5 fw-bold" onClick={() => setShowForm(false)} disabled={submitting}>Cancel Construction</button>
                   <button type="submit" className="btn btn-dark px-5 fw-bold shadow" disabled={submitting}>
                     {submitting ? 'Executing Database Rules...' : 'Create Batch'}
                   </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-0">
              {loading ? (
                <div className="p-5 text-center fw-bold text-muted">Awaiting local network nodes...</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3">Batch Array Name</th>
                        <th>Parent Course Frame</th>
                        <th>Schedule Frame</th>
                        <th className="text-center">Active Seats</th>
                        <th className="text-end px-4">Admin Controls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map(batch => (
                        <tr key={batch.id}>
                          <td className="px-4 fw-bold text-dark">{batch.batchName}</td>
                          <td className="fw-bold text-primary">{batch.course?.name || 'Orphaned'}</td>
                          <td>
                             {batch.startDate && <span className="d-block small fw-bold text-muted mb-1"><i className="fa fa-calendar-alt me-1"></i> {new Date(batch.startDate).toLocaleDateString()}</span>}
                             {batch.classTime && <span className="badge bg-secondary px-2 py-1"><i className="fa fa-clock me-1"></i> {batch.classTime}</span>}
                          </td>
                          <td className="text-center">
                             <button className="btn btn-sm btn-outline-primary fw-bold px-3 rounded-pill" onClick={() => viewStudents(batch)}>
                               <i className="fa fa-user me-1"></i> {batch.enrollments?.length || 0}
                             </button>
                          </td>
                          <td className="text-end px-4">
                            <button className="btn btn-sm btn-outline-danger shadow-sm" onClick={() => deleteBatch(batch.id)}><i className="fa fa-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                      {batches.length === 0 && <tr><td colSpan="5" className="text-center py-5 fw-bold text-muted">No Batch Arrays active inline.</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminBatches;

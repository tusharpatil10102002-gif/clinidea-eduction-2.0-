import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

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

  const viewStudents = (batchObj) => {
    setActiveBatch(batchObj);
  };

  const getRelevantMentors = (courseName) => {
    if (!courseName) return mentors;
    const cName = courseName.toLowerCase();
    const allowedPrefixes = [];
    if (cName.includes('clinical research')) allowedPrefixes.push('cr');
    if (cName.includes('pharmacovigilance')) allowedPrefixes.push('pv');
    if (cName.includes('data management')) allowedPrefixes.push('cdm');
    if (cName.includes('regulatory')) allowedPrefixes.push('ra');
    if (cName.includes('writing')) allowedPrefixes.push('mw');
    if (cName.includes('coding')) allowedPrefixes.push('mc');
    
    if (allowedPrefixes.length === 0) return mentors;
    
    return mentors.filter(m => {
      const prefix = m.email.split('@')[0].toLowerCase();
      return allowedPrefixes.includes(prefix);
    });
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
        alert("Mentor assigned and Drive folders created successfully!");
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
              <button className="btn btn-outline-dark fw-bold" onClick={() => setActiveBatch(null)}>
                <i className="fa fa-arrow-left me-2"></i> Return to Registry
              </button>
            </div>

            <div className="row g-4">
              {/* Mentor & Drive Management */}
              <div className="col-lg-5">
                <div className="card shadow-sm border-0 rounded-4 h-100">
                  <div className="card-header bg-white border-0 pt-4 pb-2">
                    <h5 className="fw-bold mb-0">Module Mentors & Drive</h5>
                  </div>
                  <div className="card-body">
                    {/* Drive Initialization */}
                    <div className="mb-4 p-3 bg-light rounded-3 border">
                      <h6 className="fw-bold mb-2">Google Drive Integration</h6>
                      {!activeBatch.driveFolderId ? (
                        <div>
                          <p className="small text-muted mb-2">Initialize a master folder on Google Drive for this batch to allow mentors to upload module content.</p>
                          <button className="btn btn-success btn-sm fw-bold w-100" onClick={() => handleInitDrive(activeBatch.id)}>
                            <i className="fab fa-google-drive me-2"></i> Initialize Drive Folder
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center text-success fw-bold">
                          <i className="fa fa-check-circle fs-4 me-2"></i> Drive Initialized
                        </div>
                      )}
                    </div>

                    {/* Mentor Assignment */}
                    <h6 className="fw-bold mb-3 border-bottom pb-2">Assign Mentors by Module</h6>
                    <p className="small text-muted mb-3">You can assign multiple mentors to different modules within this batch.</p>
                    <div className="d-flex flex-column gap-2 mb-4">
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

                    {/* Assigned Mentors List */}
                    <div className="small">
                      <strong className="d-block mb-2 text-muted">Currently Assigned:</strong>
                      <ul className="list-group list-group-flush border rounded-3">
                        {activeBatch.batchMentors?.length > 0 ? activeBatch.batchMentors.map(bm => (
                          <li key={bm.id} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3 bg-light">
                            <div>
                              <span className="fw-bold d-block text-dark">{bm.moduleName}</span>
                              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Mentor: {bm.mentor?.email || `ID: ${bm.mentorId}`}</span>
                            </div>
                            <i className="fa fa-chalkboard-teacher text-primary opacity-50"></i>
                          </li>
                        )) : <li className="list-group-item text-muted text-center py-3">No mentors assigned.</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Mapping */}
              <div className="col-lg-7">
                <div className="card shadow-sm border-0 rounded-4 h-100">
                  <div className="card-header bg-white border-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Student Roster</h5>
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
                                  {enrollments.filter(e => e.batchId === null && e.courseName === activeBatch.course?.name).map(enr => (
                                    <option key={enr.id} value={enr.id}>
                                      {enr.user?.fullName} (Enrolled)
                                    </option>
                                  ))}
                                  {users.filter(u => 
                                    u.registeredCourse === activeBatch.course?.name && 
                                    !enrollments.some(e => e.userId === u.id && e.courseName === activeBatch.course?.name)
                                  ).map(u => (
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
              </div>
            </div>
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

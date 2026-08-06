import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';

const MentorSchedule = ({ selectedBatch, showMessage }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Attendance state
  const [selectedSessionForAtt, setSelectedSessionForAtt] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  
  // Cancellation state
  const [cancelModal, setCancelModal] = useState({ show: false, session: null, reason: '' });

  useEffect(() => {
    if (selectedBatch) fetchSessions();
  }, [selectedBatch]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/sessions/${selectedBatch.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = async () => {
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/sessions/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ sessionIds: [cancelModal.session.id], reason: cancelModal.reason })
      });
      if (res.ok) {
        showMessage('Session cancelled successfully');
        setCancelModal({ show: false, session: null, reason: '' });
        fetchSessions();
      } else {
        const data = await res.json();
        showMessage(data.error || 'Failed to cancel', 'danger');
      }
    } catch (error) {
      showMessage('Error cancelling session', 'danger');
    }
  };

  const handleFetchAttendance = async (session) => {
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/attendance/${session.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAttendanceList(data.attendance || []);
        setSelectedSessionForAtt(session);
      } else {
        showMessage('Failed to fetch attendance list', 'danger');
      }
    } catch (error) {
      showMessage('Error fetching attendance list', 'danger');
    }
  };

  const submitAttendance = async () => {
    try {
      const token = localStorage.getItem('mentorToken');
      const payload = {
        classSessionId: selectedSessionForAtt.id,
        attendanceData: attendanceList.map(a => ({ userId: a.userId, status: a.status }))
      };
      
      const res = await fetch(`${BASE_URL}/api/mentor/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showMessage('Attendance marked successfully');
        setSelectedSessionForAtt(null);
      } else {
        showMessage('Failed to mark attendance', 'danger');
      }
    } catch (error) {
      showMessage('Error marking attendance', 'danger');
    }
  };

  const updateStudentStatus = (index, status) => {
    const list = [...attendanceList];
    list[index].status = status;
    setAttendanceList(list);
  };

  if (!selectedBatch) return <div className="alert alert-warning">Please select a batch from "My Batches" first.</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Schedule & Sessions - {selectedBatch.name}</h4>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Date & Time</th>
                    <th>Topic</th>
                    <th>Link</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s.id}>
                      <td className="ps-4">
                        <div className="fw-bold">{new Date(s.sessionDate).toLocaleDateString()}</div>
                        <div className="small text-muted">{s.sessionTime}</div>
                      </td>
                      <td>{s.title}</td>
                      <td>
                        {s.meetingLink ? (
                          <a href={s.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">Join</a>
                        ) : 'N/A'}
                      </td>
                      <td>
                        {s.isCancelled ? (
                          <span className="badge bg-danger">Cancelled</span>
                        ) : (
                          <span className="badge bg-success">Scheduled</span>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <div className="dropdown">
                          <button className="btn btn-sm btn-light border dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Manage
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                            <li><button className="dropdown-item" onClick={() => handleFetchAttendance(s)}><i className="fas fa-user-check text-primary me-2"></i> Attendance</button></li>
                            {!s.isCancelled && (
                              <li><button className="dropdown-item text-danger" onClick={() => setCancelModal({ show: true, session: s, reason: '' })}><i className="fas fa-times-circle me-2"></i> Cancel Session</button></li>
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-4 text-muted">No sessions found for this batch.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal / View */}
      {selectedSessionForAtt && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Mark Attendance - {new Date(selectedSessionForAtt.sessionDate).toLocaleDateString()}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedSessionForAtt(null)}></button>
              </div>
              <div className="modal-body p-0">
                <table className="table mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Student</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((att, idx) => (
                      <tr key={att.userId}>
                        <td className="ps-4 fw-bold">{att.studentName}</td>
                        <td className="text-muted small">{att.email}</td>
                        <td>
                          <select className={`form-select form-select-sm fw-bold ${att.status === 'present' ? 'text-success' : (att.status === 'absent' ? 'text-danger' : '')}`}
                                  value={att.status} onChange={(e) => updateStudentStatus(idx, e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer border-top-0 pt-0 mt-3">
                <button type="button" className="btn btn-light" onClick={() => setSelectedSessionForAtt(null)}>Close</button>
                <button type="button" className="btn btn-primary fw-bold" onClick={submitAttendance}>Save Attendance</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal.show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">Cancel Session</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setCancelModal({ show: false, session: null, reason: '' })}></button>
              </div>
              <div className="modal-body p-4">
                <p>Are you sure you want to cancel the session on <strong>{new Date(cancelModal.session.sessionDate).toLocaleDateString()}</strong>?</p>
                <label className="form-label fw-bold">Reason for cancellation (required)</label>
                <textarea className="form-control" rows="3" value={cancelModal.reason} onChange={(e) => setCancelModal({...cancelModal, reason: e.target.value})}></textarea>
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-light" onClick={() => setCancelModal({ show: false, session: null, reason: '' })}>Close</button>
                <button type="button" className="btn btn-danger fw-bold" disabled={!cancelModal.reason.trim()} onClick={handleCancelSession}>Confirm Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSchedule;

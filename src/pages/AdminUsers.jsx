import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminUsers = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected User Panel
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const fetchUsers = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    const url = `${BASE_URL}/api/admin/users`;
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if(!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized');
          throw new Error('Failed to fetch users');
        }
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') {
          console.error("Fetch error:", err);
          setLoading(false);
        }
      });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      const url = `${BASE_URL}/api/admin/users/${id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      const updatedUser = await res.json();
      
      // Update local state
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (err) {
      alert("Error updating status.");
    }
  };

  const handleGrantFreeAccess = async (id) => {
    if (!window.confirm("Are you sure you want to bypass the 500 INR registration fee for this user?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const url = `${BASE_URL}/api/admin/users/${id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ registrationFeePaid: true })
      });
      if (!res.ok) throw new Error('Failed to grant access');
      
      const updatedUser = await res.json();
      
      // Update local state
      setUsers(users.map(u => u.id === id ? { ...u, registrationFeePaid: true } : u));
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, registrationFeePaid: true });
      }
      alert("Registration fee bypassed successfully!");
    } catch (err) {
      alert("Error bypassing registration fee.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to completely delete this user? This cannot be undone.")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        if (selectedUser && selectedUser.id === id) setSelectedUser(null);
      } else {
        let errMsg = "Failed to delete user.";
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch (e) {}
        alert(errMsg);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user: " + err.message);
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === '' || user.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="d-flex justify-content-center mt-5">Loading Users...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="admin-content">
        <h2 className="mb-4 fw-bold" style={{ color: 'var(--color-primary)' }}>Users Management</h2>

        {/* Toolbar */}
        <div className="d-flex justify-content-between mb-4 gap-3 bg-white p-3 rounded-4 shadow-sm border text-dark">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search name, phone, or email..." 
            style={{ maxWidth: '400px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="form-select" 
            style={{ maxWidth: '200px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4">Date Registered</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Registered Course</th>
                    <th>Status</th>
                    <th className="text-end px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="py-3 px-4 text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="fw-bold">{user.fullName}</td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.registeredCourse ? (
                           <span className="badge bg-info text-dark fw-bold text-wrap" style={{ lineHeight: '1.4' }}>{user.registeredCourse}</span>
                        ) : (
                           <span className="text-muted small">Not Selected</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${user.status.toLowerCase() === 'active' ? 'bg-success' : 'bg-danger'}`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end px-4">
                        <button 
                          className="btn btn-sm btn-dark fw-bold"
                          onClick={() => setSelectedUser(user)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                     <tr><td colSpan="6" className="text-center py-5">No registered users matched your criteria.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over User Details Panel */}
      {selectedUser && (
        <div 
           className="bg-white border-start shadow-lg position-fixed top-0 bottom-0 end-0 p-4 custom-scrollbar"
           style={{ width: '100%', maxWidth: '450px', zIndex: 1050, overflowY: 'scroll' }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <h4 className="fw-bold mb-0">User Details</h4>
          </div>
            <button className="btn-close" onClick={() => setSelectedUser(null)}></button>
          </div>

          <div className="mb-4">
            <label className="fw-bold mb-1 text-muted">Full Name</label>
            <p className="fs-5">{selectedUser.fullName}</p>
          </div>

          <div className="mb-4">
            <label className="fw-bold mb-1 text-muted">Contact Info</label>
            <p className="mb-0"><a href={`mailto:${selectedUser.email}`}>{selectedUser.email}</a></p>
            <p><a href={`tel:${selectedUser.phone}`}>{selectedUser.phone}</a></p>
          </div>

          <div className="mb-4">
            <label className="fw-bold mb-1 text-muted">Role</label>
            <p className="fs-5 text-capitalize">{selectedUser.role}</p>
          </div>

          <div className="mb-4 bg-light p-3 rounded-3 border">
            <label className="fw-bold mb-2">Registration Status</label>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className={`badge ${selectedUser.registrationFeePaid ? 'bg-success' : 'bg-warning text-dark'}`}>
                {selectedUser.registrationFeePaid ? 'PAID / BYPASSED' : 'PENDING 500 INR'}
              </span>
              {!selectedUser.registrationFeePaid && (
                <button 
                  className="btn btn-sm btn-outline-success fw-bold"
                  onClick={() => handleGrantFreeAccess(selectedUser.id)}
                >
                  <i className="fa fa-check me-1"></i> Grant Free Access
                </button>
              )}
            </div>
            {selectedUser.registeredCourse && (
               <div className="small bg-white p-2 rounded border mt-2">
                 <span className="fw-bold text-muted">Registered Course:</span><br/>
                 <span className="text-dark fw-bold">{selectedUser.registeredCourse}</span>
               </div>
            )}
          </div>

          <div className="mb-4 bg-light p-3 rounded-3 border">
            <label className="fw-bold mb-2">Modify Status</label>
            <select 
              className="form-select"
              value={selectedUser.status}
              onChange={(e) => handleStatusUpdate(selectedUser.id, e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
            <small className="text-muted d-block mt-2">
              Warning: Changing to 'Inactive' will instantly revoke their dashboard access tokens.
            </small>
          </div>

          <div className="mt-4 pt-3 border-top">
            <button 
              className="btn btn-danger w-100 fw-bold"
              onClick={() => handleDeleteUser(selectedUser.id)}
            >
              <i className="fa fa-trash me-2"></i> Permanently Delete User
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminUsers;

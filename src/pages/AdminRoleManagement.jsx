import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';

const AdminRoleManagement = () => {
  const [users, setUsers] = array => useState([]);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'superadmin' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      setSuccess('User created successfully');
      setFormData({ email: '', password: '', role: 'superadmin' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid p-4">
      <Helmet>
        <title>Role Management | Admin</title>
      </Helmet>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0" style={{ color: 'var(--color-primary)' }}>Role Management</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Create New Account</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    minLength="6"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Role</label>
                  <select 
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="mentor">Mentor</option>
                    <option value="student_coordinator">Student Coordinator</option>
                    <option value="lead_manager">Lead Manager</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Existing Accounts</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td className="fw-medium">{user.email}</td>
                        <td>
                          <span className={`badge bg-${user.role === 'superadmin' ? 'danger' : user.role === 'mentor' ? 'primary' : 'warning'} px-3 py-2 rounded-pill`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user.id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoleManagement;

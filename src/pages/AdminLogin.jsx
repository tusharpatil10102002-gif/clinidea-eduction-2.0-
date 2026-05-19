import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = `${BASE_URL}/api/admin/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminLastActivity', Date.now().toString());
      if (data.role) {
        localStorage.setItem('adminRole', data.role);
      } else {
        localStorage.setItem('adminRole', 'superadmin'); // fallback
      }
      
      if (data.role === 'mentor') {
        navigate('/admin/lms');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--color-bg-light)' }}>
      <div className="p-5 bg-white rounded-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 style={{ fontWeight: '800', color: 'var(--color-primary)' }}>Admin Login</h2>
          <p className="text-muted">Enter credentials to access the panel</p>
        </div>
        {error && <div className="alert alert-danger p-2 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email address</label>
            <input 
              type="email" 
              className="form-control p-3 bg-light border-0" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control p-3 bg-light border-0" 
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-3 fw-bold fs-5" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)', border: 'none' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

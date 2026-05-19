import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BASE_URL } from '../config';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = `${BASE_URL}/api/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store token directly in localStorage corresponding to the user 
      localStorage.setItem('userToken', data.token);
      
      // Send user to redirect path if exists, else dashboard
      navigate(redirectPath); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5 mt-5" style={{ minHeight: '100vh', background: 'var(--color-bg-light)' }}>
      <div className="p-4 p-md-5 bg-white rounded-4 shadow-lg mx-3" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 style={{ fontWeight: '800', color: 'var(--color-primary)' }}>Student Login</h2>
          <p className="text-muted">Welcome back to your educational journey</p>
        </div>
        
        {error && <div className="alert alert-danger p-3 text-center fw-bold">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email or Phone Number</label>
            <input 
              type="text" 
              name="identifier"
              className="form-control p-3 bg-light border-0" 
              placeholder="jane@email.com"
              value={formData.identifier}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-control p-3 bg-light border-0" 
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn w-100 py-3 fw-bold fs-5 text-white shadow-sm" 
            style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', border: 'none' }} 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-muted">Don't have an account? <Link to={`/register${location.search}`} className="fw-bold text-decoration-none" style={{color: 'var(--color-accent)'}}>Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

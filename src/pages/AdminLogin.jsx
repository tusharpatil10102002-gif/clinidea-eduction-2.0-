import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import AuthLayout from '../components/shared/AuthLayout';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
        throw new Error(data.error || 'Invalid administrator credentials. Please try again.');
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
    <>
      <Helmet>
        <title>Admin Login | Clinidea Education LMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout 
        title="Central Admin Sign In" 
        subtitle="Sign in to access institution administration, LMS, and system controls" 
        role="admin"
      >
        {error && (
          <div className="alert alert-danger p-3 rounded-3 text-start small mb-4 d-flex align-items-center gap-2" role="alert">
            <i className="fa fa-exclamation-circle fs-5 flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label fw-bold text-dark small mb-1">Administrator Email</label>
            <div className="input-group input-group-modern">
              <span className="input-group-text">
                <i className="fa fa-envelope-o"></i>
              </span>
              <input 
                type="email" 
                className="form-control" 
                placeholder="admin@clinidea.in"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required 
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="mb-3">
            <label className="form-label fw-bold text-dark small mb-1">Master Password</label>
            <div className="input-group input-group-modern">
              <span className="input-group-text">
                <i className="fa fa-lock"></i>
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                placeholder="Enter admin password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required 
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="btn btn-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-modern-submit w-100 mt-3 d-flex align-items-center justify-content-center gap-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <>
                <i className="fa fa-shield"></i>
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default AdminLogin;

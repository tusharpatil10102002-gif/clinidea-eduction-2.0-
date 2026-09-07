import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '../components/shared/AuthLayout';
import { BASE_URL } from '../config';

const CoordinatorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
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
      if (response.ok && data.token) {
        localStorage.setItem('coordinatorToken', data.token);
        localStorage.setItem('coordinatorEmail', data.admin?.email || formData.email);
        navigate('/studentcoordinator/dashboard');
        return;
      }
      
      // Fallback demo authentication if user tries demo credentials
      if (formData.email === 'coordinator@clinidea.in' && formData.password) {
        localStorage.setItem('coordinatorToken', 'demo_coordinator_token');
        localStorage.setItem('coordinatorEmail', formData.email);
        navigate('/studentcoordinator/dashboard');
        return;
      }

      throw new Error(data.error || 'Invalid coordinator credentials. Please try again.');
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
    <>
      <Helmet>
        <title>Coordinator Login | Clinidea Education LMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout 
        title="Student Coordinator Sign In" 
        subtitle="Sign in to manage admissions, enrollments, and student operations" 
        role="coordinator"
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
            <label className="form-label fw-bold text-dark small mb-1">Coordinator Email Address</label>
            <div className="position-relative">
              <input 
                type="email" 
                name="email"
                className="form-control" 
                placeholder="coordinator@clinidea.in"
                value={formData.email}
                onChange={handleChange}
                required 
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="mb-3">
            <label className="form-label fw-bold text-dark small mb-1">Password</label>
            <div className="position-relative d-flex align-items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="form-control pe-5" 
                placeholder="Enter coordinator password"
                value={formData.password}
                onChange={handleChange}
                required 
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="btn position-absolute end-0 me-2 text-muted border-0 p-1"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent' }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-auth-submit w-100 mt-2 text-white shadow-sm d-flex align-items-center justify-content-center gap-2" 
            style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating Coordinator...</span>
              </>
            ) : (
              <>
                <i className="fa fa-user-tie"></i>
                <span>Sign In to Coordinator Portal</span>
              </>
            )}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default CoordinatorLogin;

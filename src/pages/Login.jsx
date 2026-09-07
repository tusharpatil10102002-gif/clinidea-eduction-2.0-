import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import AuthLayout from '../components/shared/AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const [formData, setFormData] = useState({
    identifier: '',
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
      const url = `${BASE_URL}/api/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }
      
      localStorage.setItem('userToken', data.token);
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
    <>
      <Helmet>
        <title>Student Login | Clinidea Education LMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout 
        title="Student Sign In" 
        subtitle="Access your clinical research courses, live sessions, and study materials" 
        role="student"
      >
        {error && (
          <div className="alert alert-danger p-3 rounded-3 text-start small mb-4 d-flex align-items-center gap-2" role="alert">
            <i className="fa fa-exclamation-circle fs-5 flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Identifier Input */}
          <div className="mb-3">
            <label className="form-label fw-bold text-dark small mb-1">
              Registered Email or Phone Number
            </label>
            <div className="input-group input-group-modern">
              <span className="input-group-text">
                <i className="fa fa-envelope-o"></i>
              </span>
              <input 
                type="text" 
                name="identifier"
                className="form-control" 
                placeholder="name@email.com or 10-digit phone"
                value={formData.identifier}
                onChange={handleChange}
                required 
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label fw-bold text-dark small mb-0">Password</label>
              <Link to="/forgot-password" className="small text-decoration-none text-primary fw-semibold" tabIndex="-1">
                Forgot password?
              </Link>
            </div>
            <div className="input-group input-group-modern">
              <span className="input-group-text">
                <i className="fa fa-lock"></i>
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="form-control" 
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
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
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <i className="fa fa-sign-in"></i>
                <span>Sign In to Student LMS</span>
              </>
            )}
          </button>
        </form>

        {/* Registration Prompt */}
        <div className="text-center mt-4 pt-2">
          <p className="text-muted small mb-0">
            Don't have an account?{' '}
            <Link to={`/register${location.search}`} className="fw-bold text-decoration-none text-primary">
              Register here
            </Link>
          </p>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;

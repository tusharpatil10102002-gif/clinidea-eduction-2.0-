import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import AuthLayout from '../components/shared/AuthLayout';

const MentorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = `${BASE_URL}/api/mentor/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('mentorToken', data.token);
      navigate('/mentor/dashboard'); 
      
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
        <title>Mentor Login | Clinidea Education</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout 
        title="Mentor Portal" 
        subtitle="Sign in to manage your batches and content" 
        role="mentor" 
        accentColor="success"
      >
        {error && <div className="alert alert-danger p-3 text-center fw-bold">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input 
              type="email" 
              name="email"
              className="form-control p-3 bg-light border-0" 
              placeholder="mentor@clinidea.in"
              value={formData.email}
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
            className="btn text-white w-100 py-3 fw-bold fs-5 shadow-sm" 
            style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', border: 'none' }} 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default MentorLogin;

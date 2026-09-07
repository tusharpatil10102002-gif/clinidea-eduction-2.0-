import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '../components/shared/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Clinidea Education LMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout
        title="Reset Password"
        subtitle="Enter your registered email to receive secure password reset instructions"
        role="student"
      >
        {submitted ? (
          <div className="alert alert-success rounded-4 text-center p-4 mb-4">
            <i className="fa fa-paper-plane fs-3 mb-2 text-success d-block"></i>
            <h6 className="fw-bold mb-1">Reset Instructions Dispatched</h6>
            <p className="small mb-0 text-muted">A password reset link has been sent to <strong>{email}</strong> if an account exists.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small mb-1">Registered Email Address</label>
              <div className="input-group input-group-modern">
                <span className="input-group-text">
                  <i className="fa fa-envelope-o"></i>
                </span>
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-modern-submit w-100 mt-3 d-flex align-items-center justify-content-center gap-2">
              <i className="fa fa-key"></i>
              <span>Send Reset Link</span>
            </button>
          </form>
        )}

        <div className="text-center mt-3 pt-2">
          <Link to="/login" className="text-decoration-none small fw-bold text-primary">
            <i className="fa fa-arrow-left me-1"></i> Back to Login
          </Link>
        </div>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;

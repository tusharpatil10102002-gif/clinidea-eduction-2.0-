import React from 'react';
import { Link } from 'react-router-dom';

const ROLE_CONFIGS = {
  student: {
    key: 'student',
    label: 'Student',
    fullTitle: 'Student Learning Portal',
    icon: 'fa-graduation-cap',
    path: '/login',
    accentColor: '#4f46e5',
    secondaryColor: '#3b82f6',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    glowColor: 'rgba(79, 70, 229, 0.4)',
    bgOrb: 'rgba(79, 70, 229, 0.25)',
    tagline: 'Access clinical research courses, live sessions & study materials',
    badgeText: 'STUDENT LMS'
  },
  mentor: {
    key: 'mentor',
    label: 'Mentor',
    fullTitle: 'Faculty & Mentor Portal',
    icon: 'fa-chalkboard-teacher',
    path: '/mentor/login',
    accentColor: '#059669',
    secondaryColor: '#10b981',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    glowColor: 'rgba(5, 150, 105, 0.4)',
    bgOrb: 'rgba(5, 150, 105, 0.25)',
    tagline: 'Manage batch schedules, study materials, and assessments',
    badgeText: 'FACULTY LMS'
  },
  coordinator: {
    key: 'coordinator',
    label: 'Coordinator',
    fullTitle: 'Student Operations Portal',
    icon: 'fa-user-tie',
    path: '/studentcoordinator/login',
    accentColor: '#d97706',
    secondaryColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    bgOrb: 'rgba(217, 119, 6, 0.25)',
    tagline: 'Manage admissions, enrollments, and student operations',
    badgeText: 'OPERATIONS'
  },
  admin: {
    key: 'admin',
    label: 'Admin',
    fullTitle: 'Institutional Command',
    icon: 'fa-shield-alt',
    path: '/admin/login',
    accentColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    bgOrb: 'rgba(99, 102, 241, 0.25)',
    tagline: 'Institution administration, LMS, and system controls',
    badgeText: 'SUPER ADMIN'
  }
};

const AuthLayout = ({ title, subtitle, role = 'student', children }) => {
  const currentRole = ROLE_CONFIGS[role] || ROLE_CONFIGS.student;

  return (
    <div 
      className="auth-ultra-wrapper position-relative min-vh-100 d-flex flex-column justify-content-center align-items-center py-4 px-3"
      style={{
        backgroundColor: '#090e17',
        backgroundImage: `
          radial-gradient(at 0% 0%, ${currentRole.bgOrb} 0px, transparent 50%),
          radial-gradient(at 100% 100%, ${currentRole.bgOrb} 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(15, 23, 42, 0.8) 0px, transparent 100%)
        `,
        overflowX: 'hidden',
        fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif"
      }}
    >
      {/* Background Cyber Grid Lines */}
      <div 
        className="position-absolute w-100 h-100 top-0 start-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.8,
          zIndex: 0
        }}
      />

      {/* Floating Ambient Glow Flare */}
      <div 
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: currentRole.glowColor,
          filter: 'blur(120px)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.35,
          zIndex: 0,
          transition: 'all 0.5s ease-in-out'
        }}
      />

      {/* Main Container */}
      <div className="container position-relative z-2" style={{ maxWidth: '1140px' }}>
        
        {/* Top Header Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none">
            <div 
              className="p-2 rounded-4 d-flex align-items-center justify-content-center shadow-lg"
              style={{
                width: '52px',
                height: '52px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <img 
                src="/clinidea Logo/Clinidea_Education_Logo_header.webp" 
                alt="Clinidea Education" 
                className="img-fluid"
                style={{ maxHeight: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.src = '/assets/images/logo.png'; }}
              />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-white fs-4" style={{ letterSpacing: '-0.5px' }}>CLINIDEA</span>
                <span 
                  className="badge rounded-pill px-2 py-1 fw-bold text-uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.8px',
                    background: currentRole.gradient,
                    color: '#ffffff',
                    boxShadow: `0 2px 8px ${currentRole.glowColor}`
                  }}
                >
                  LMS 2.0
                </span>
              </div>
              <small className="text-white-50 d-block" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                Institute of Clinical Research & Pharmacovigilance
              </small>
            </div>
          </Link>

          {/* System Status Pill */}
          <div 
            className="d-none d-sm-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="live-pulse-dot" style={{ backgroundColor: '#10b981' }}></span>
            <span className="text-white-50 small fw-medium" style={{ fontSize: '12px' }}>
              System Status: <strong className="text-white">Active & DRM Protected</strong>
            </span>
          </div>
        </div>

        {/* 4-Way Segmented Portal Switcher */}
        <div className="d-flex justify-content-center mb-4">
          <div 
            className="d-inline-flex p-1 rounded-4 shadow-lg"
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              maxWidth: '100%',
              overflowX: 'auto'
            }}
          >
            {Object.values(ROLE_CONFIGS).map((cfg) => {
              const isActive = role === cfg.key;
              return (
                <Link
                  key={cfg.key}
                  to={cfg.path}
                  className={`btn py-2 px-3 px-md-4 rounded-3 text-decoration-none d-flex align-items-center gap-2 fw-bold text-nowrap transition-all ${
                    isActive ? 'text-white' : 'text-white-50 hover-tab'
                  }`}
                  style={{
                    fontSize: '13px',
                    letterSpacing: '-0.2px',
                    background: isActive ? cfg.gradient : 'transparent',
                    boxShadow: isActive ? `0 4px 14px ${cfg.glowColor}` : 'none',
                    border: 'none',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <i className={`fa ${cfg.icon}`}></i>
                  <span>{cfg.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dual-Pane Grid Layout */}
        <div className="row g-4 align-items-stretch justify-content-center">
          
          {/* LEFT COLUMN: Modern Feature Showcase (Desktop & Tablet) */}
          <div className="col-lg-6 col-xl-6 d-none d-lg-flex flex-column justify-content-between p-4 p-xl-5 rounded-4 position-relative overflow-hidden"
            style={{
              background: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Ambient inner glow */}
            <div 
              className="position-absolute"
              style={{
                top: '-20%',
                left: '-20%',
                width: '350px',
                height: '350px',
                background: currentRole.glowColor,
                filter: 'blur(80px)',
                opacity: 0.2,
                pointerEvents: 'none'
              }}
            />

            <div>
              {/* Role Indicator Pill */}
              <div 
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <i className={`fa ${currentRole.icon}`} style={{ color: currentRole.secondaryColor }}></i>
                <span className="small text-white fw-semibold" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>
                  {currentRole.fullTitle.toUpperCase()}
                </span>
              </div>

              <h1 className="display-6 fw-bold text-white mb-3" style={{ letterSpacing: '-0.8px', lineHeight: '1.2' }}>
                Next-Gen Clinical Research Learning Management System
              </h1>

              <p className="text-white-50 mb-4" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Empowering clinical researchers, pharmacovigilance specialists, and mentors with encrypted high-definition streaming, real-time GCP curriculums, and secure multi-tenant portals.
              </p>

              {/* 3 Modern Feature Cards */}
              <div className="d-flex flex-column gap-3 mb-4">
                <div 
                  className="p-3 rounded-4 d-flex align-items-center gap-3 transition-all feature-chip"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '42px',
                      height: '42px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444'
                    }}
                  >
                    <i className="fa fa-play-circle fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14px' }}>Anti-Piracy Video Player</h6>
                    <small className="text-white-50" style={{ fontSize: '12px' }}>High-definition lecture streaming protected with anti-copy DRM and verified roster access.</small>
                  </div>
                </div>

                <div 
                  className="p-3 rounded-4 d-flex align-items-center gap-3 transition-all feature-chip"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '42px',
                      height: '42px',
                      background: 'rgba(14, 165, 233, 0.15)',
                      color: '#0ea5e9'
                    }}
                  >
                    <i className="fa fa-book fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14px' }}>Curriculum & Study Materials</h6>
                    <small className="text-white-50" style={{ fontSize: '12px' }}>Instant access to presentations, ICH-GCP protocols, and regulatory case studies.</small>
                  </div>
                </div>

                <div 
                  className="p-3 rounded-4 d-flex align-items-center gap-3 transition-all feature-chip"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '42px',
                      height: '42px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981'
                    }}
                  >
                    <i className="fa fa-shield fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14px' }}>Role-Based Institutional Security</h6>
                    <small className="text-white-50" style={{ fontSize: '12px' }}>Dedicated access boundaries for Students, Faculty Mentors, and Administrators.</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Trust Indicators */}
            <div className="pt-4 border-top d-flex justify-content-between align-items-center text-white-50 small" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span><i className="fa fa-lock text-success me-1"></i> 256-Bit SSL Encrypted</span>
              <span><i className="fa fa-graduation-cap text-primary me-1"></i> 1,200+ Alumni</span>
              <span><i className="fa fa-certificate text-warning me-1"></i> ISO 9001:2015</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Ultra-Modern Glassmorphic Auth Card */}
          <div className="col-12 col-md-8 col-lg-6 col-xl-5 d-flex flex-column justify-content-center">
            <div 
              className="p-4 p-sm-5 rounded-4 shadow-2xl position-relative auth-glass-card"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                borderRadius: '24px'
              }}
            >
              {/* Active Role Accent Stripe */}
              <div 
                className="position-absolute top-0 start-50 translate-middle-x rounded-pill"
                style={{
                  width: '80px',
                  height: '4px',
                  background: currentRole.gradient,
                  boxShadow: `0 2px 10px ${currentRole.glowColor}`
                }}
              />

              {/* Card Header */}
              <div className="text-center mb-4 pt-1">
                <div 
                  className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                  style={{
                    background: `${currentRole.accentColor}12`,
                    border: `1px solid ${currentRole.accentColor}30`,
                    color: currentRole.accentColor,
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '0.3px'
                  }}
                >
                  <i className={`fa ${currentRole.icon}`}></i>
                  <span>{currentRole.badgeText}</span>
                </div>

                <h2 className="fw-bold mb-2 text-dark" style={{ letterSpacing: '-0.6px', fontSize: '24px' }}>
                  {title}
                </h2>
                <p className="text-muted small mb-0" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                  {subtitle || currentRole.tagline}
                </p>
              </div>

              {/* Injected Form Component */}
              <div className="auth-form-container">
                {children}
              </div>

              {/* Card Footer: Back to Website Link */}
              <div className="pt-4 mt-4 border-top text-center" style={{ borderColor: '#f1f5f9' }}>
                <Link 
                  to="/" 
                  className="text-muted small text-decoration-none d-inline-flex align-items-center gap-2 hover-back-link fw-semibold"
                  style={{ transition: 'all 0.2s' }}
                >
                  <i className="fa fa-arrow-left"></i>
                  <span>Back to Clinidea Website</span>
                </Link>
              </div>

            </div>

            {/* Mobile / Tablet Trust Badges (Visible below card on small screens) */}
            <div className="d-lg-none d-flex justify-content-center align-items-center gap-3 text-white-50 small mt-4 text-center">
              <span><i className="fa fa-lock text-success me-1"></i> 256-Bit SSL</span>
              <span>•</span>
              <span><i className="fa fa-shield text-info me-1"></i> DRM Protected</span>
              <span>•</span>
              <span><i className="fa fa-check-circle text-warning me-1"></i> ISO Certified</span>
            </div>

            {/* Copyright */}
            <div className="text-center mt-3">
              <small className="text-white-50" style={{ fontSize: '11px', opacity: 0.7 }}>
                &copy; {new Date().getFullYear()} Clinidea Education LMS. All Rights Reserved.
              </small>
            </div>

          </div>

        </div>

      </div>

      {/* Global Embedded Styles for Ultra-Modern LMS Theme */}
      <style dangerouslySetInnerHTML={{__html: `
        .live-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .hover-tab:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        .feature-chip:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          transform: translateX(4px);
        }
        .hover-back-link:hover {
          color: ${currentRole.accentColor} !important;
          transform: translateX(-3px);
        }
        
        /* Ultra Modern Input Field Styling */
        .auth-ultra-wrapper .input-group-modern {
          background-color: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .auth-ultra-wrapper .input-group-modern:focus-within {
          background-color: #ffffff;
          border-color: ${currentRole.accentColor};
          box-shadow: 0 0 0 4px ${currentRole.glowColor} !important;
        }
        .auth-ultra-wrapper .input-group-modern .input-group-text {
          background: transparent !important;
          border: none !important;
          color: #64748b;
          font-size: 15px;
          padding-left: 16px;
          padding-right: 12px;
        }
        .auth-ultra-wrapper .input-group-modern:focus-within .input-group-text {
          color: ${currentRole.accentColor};
        }
        .auth-ultra-wrapper .input-group-modern .form-control {
          background: transparent !important;
          border: none !important;
          padding: 13px 16px 13px 0 !important;
          font-size: 14px !important;
          color: #0f172a !important;
          font-weight: 500;
        }
        .auth-ultra-wrapper .input-group-modern .form-control:focus {
          box-shadow: none !important;
        }
        .auth-ultra-wrapper .input-group-modern .btn-eye-toggle {
          background: transparent !important;
          border: none !important;
          color: #94a3b8;
          padding: 0 16px;
          transition: color 0.2s;
        }
        .auth-ultra-wrapper .input-group-modern .btn-eye-toggle:hover {
          color: #0f172a;
        }

        /* Modern Submit Button */
        .auth-ultra-wrapper .btn-modern-submit {
          background: ${currentRole.gradient} !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 14px !important;
          padding: 14px 20px !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          letter-spacing: -0.2px !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 10px 20px -5px ${currentRole.glowColor} !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .auth-ultra-wrapper .btn-modern-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 14px 25px -4px ${currentRole.glowColor} !important;
        }
        .auth-ultra-wrapper .btn-modern-submit:active:not(:disabled) {
          transform: translateY(0);
        }
      `}} />
    </div>
  );
};

export default AuthLayout;

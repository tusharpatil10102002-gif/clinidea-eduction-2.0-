import React from 'react';
import { Link } from 'react-router-dom';

const ROLE_CONFIGS = {
  student: {
    label: 'Student Portal',
    icon: 'fa-graduation-cap',
    path: '/login',
    badgeClass: 'bg-primary text-white',
    accentColor: '#4f46e5',
    tagline: 'Student Learning Management System'
  },
  mentor: {
    label: 'Mentor Portal',
    icon: 'fa-chalkboard-teacher',
    path: '/mentor/login',
    badgeClass: 'bg-success text-white',
    accentColor: '#059669',
    tagline: 'Faculty & Curriculum Command'
  },
  coordinator: {
    label: 'Coordinator Portal',
    icon: 'fa-user-tie',
    path: '/studentcoordinator/login',
    badgeClass: 'bg-warning text-dark',
    accentColor: '#d97706',
    tagline: 'Admissions & Student Operations'
  },
  admin: {
    label: 'Admin Portal',
    icon: 'fa-shield-alt',
    path: '/admin/login',
    badgeClass: 'bg-dark text-white',
    accentColor: '#4338ca',
    tagline: 'Central Institutional Administration'
  }
};

const AuthLayout = ({ title, subtitle, role = 'student', children }) => {
  const currentRole = ROLE_CONFIGS[role] || ROLE_CONFIGS.student;

  return (
    <div className="auth-root-wrapper" style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc', overflowX: 'hidden' }}>
      <div className="row g-0 w-100 flex-grow-1 position-relative">
        
        {/* ============================================================ */}
        {/* LEFT SIDE: Modern LMS Graphic Showcase (Hidden on Mobile)     */}
        {/* ============================================================ */}
        <div 
          className="d-none d-lg-flex col-lg-5 col-xl-5 flex-column justify-content-between p-5 position-relative overflow-hidden" 
          style={{ 
            background: 'linear-gradient(145deg, #090d16 0%, #0f172a 40%, #1e1b4b 100%)',
            color: '#ffffff',
            boxShadow: 'inset -1px 0 0 rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Ambient Glow Orbs */}
          <div 
            className="position-absolute" 
            style={{ 
              top: '-15%', 
              left: '-15%', 
              width: '520px', 
              height: '520px', 
              background: 'radial-gradient(circle, rgba(79, 70, 229, 0.28) 0%, rgba(79, 70, 229, 0) 70%)', 
              filter: 'blur(70px)', 
              pointerEvents: 'none' 
            }} 
          />
          <div 
            className="position-absolute" 
            style={{ 
              bottom: '-15%', 
              right: '-15%', 
              width: '450px', 
              height: '450px', 
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(14, 165, 233, 0) 70%)', 
              filter: 'blur(60px)', 
              pointerEvents: 'none' 
            }} 
          />
          
          {/* Subtle Grid Pattern Overlay */}
          <div 
            className="position-absolute w-100 h-100 top-0 start-0" 
            style={{ 
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)', 
              backgroundSize: '32px 32px', 
              opacity: 0.25, 
              pointerEvents: 'none' 
            }} 
          />

          {/* Top Branding */}
          <div className="position-relative z-2">
            <Link to="/" className="d-inline-flex align-items-center gap-3 text-decoration-none">
              <div 
                className="rounded-4 p-2 bg-white d-flex align-items-center justify-content-center shadow" 
                style={{ width: '56px', height: '56px', border: '1px solid rgba(255,255,255,0.2)' }}
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
                <h3 className="mb-0 fw-bold text-white fs-4" style={{ letterSpacing: '-0.5px' }}>Clinidea LMS</h3>
                <small className="text-white-50 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '1px' }}>Education & Research</small>
              </div>
            </Link>
          </div>

          {/* Mid Value Props */}
          <div className="position-relative z-2 my-auto py-5">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <span className="badge rounded-pill bg-warning text-dark fw-bold px-2 py-1" style={{ fontSize: '10px' }}>PRO LMS 2.0</span>
              <span className="small text-white-50 fw-semibold">Clinical Research Excellence</span>
            </div>

            <h1 className="display-6 fw-bold mb-3 text-white" style={{ lineHeight: '1.25', letterSpacing: '-0.8px' }}>
              Advanced Clinical Research & Pharmacovigilance Learning System
            </h1>
            <p className="fs-6 text-white-50 mb-4" style={{ maxWidth: '90%', lineHeight: '1.6' }}>
              Access industry-grade curriculum, live expert mentorship, DRM-protected video archives, and real-time assessments.
            </p>

            {/* Feature Highlights Grid */}
            <div className="row g-3 mt-2" style={{ maxWidth: '95%' }}>
              <div className="col-12 col-sm-6">
                <div className="p-3 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="fa fa-video-camera text-danger"></i>
                    <strong className="small text-white">Live & HD Archives</strong>
                  </div>
                  <small className="text-white-50 d-block" style={{ fontSize: '12px' }}>Anti-piracy DRM playback with interactive doubt resolution.</small>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="p-3 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="fa fa-book text-info"></i>
                    <strong className="small text-white">ICH-GCP Materials</strong>
                  </div>
                  <small className="text-white-50 d-block" style={{ fontSize: '12px' }}>Comprehensive presentations, study modules, and protocols.</small>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="p-3 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="fa fa-shield text-success"></i>
                    <strong className="small text-white">Role-Scoped Security</strong>
                  </div>
                  <small className="text-white-50 d-block" style={{ fontSize: '12px' }}>Dedicated portals for Students, Mentors, and Administrators.</small>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="p-3 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="fa fa-certificate text-warning"></i>
                    <strong className="small text-white">Accredited Credentials</strong>
                  </div>
                  <small className="text-white-50 d-block" style={{ fontSize: '12px' }}>Verifiable certificates and 100% placement track record.</small>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Banner */}
          <div className="position-relative z-2 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="d-flex align-items-center justify-content-between text-white-50 small">
              <span><i className="fa fa-lock text-success me-1"></i> 256-bit SSL Encrypted</span>
              <span><i className="fa fa-users text-primary me-1"></i> 1,200+ Alumni</span>
              <span><i className="fa fa-check-circle text-warning me-1"></i> ISO Certified Institute</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT SIDE: Harmonized Auth Card & Role Switcher             */}
        {/* ============================================================ */}
        <div className="col-12 col-lg-7 col-xl-7 d-flex flex-column justify-content-center align-items-center position-relative py-5 px-3 px-sm-4">
          
          {/* Subtle background glow on right side */}
          <div 
            className="position-absolute top-0 end-0" 
            style={{ 
              width: '400px', 
              height: '400px', 
              background: 'radial-gradient(circle, rgba(79, 70, 229, 0.06) 0%, rgba(79, 70, 229, 0) 70%)', 
              filter: 'blur(50px)', 
              pointerEvents: 'none' 
            }} 
          />

          <div className="w-100 position-relative z-2" style={{ maxWidth: '500px' }}>
            
            {/* Mobile Header Branding */}
            <div className="d-lg-none text-center mb-4">
              <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none">
                <div 
                  className="rounded-3 p-2 bg-white d-inline-flex align-items-center justify-content-center shadow-sm" 
                  style={{ width: '48px', height: '48px', border: '1px solid #e2e8f0' }}
                >
                  <img 
                    src="/clinidea Logo/Clinidea_Education_Logo_header.webp" 
                    alt="Clinidea" 
                    className="img-fluid" 
                    onError={(e) => { e.target.src = '/assets/images/logo.png'; }} 
                  />
                </div>
                <div className="text-start">
                  <h4 className="mb-0 fw-bold text-dark fs-5">Clinidea Education</h4>
                  <small className="text-muted">Clinical Research LMS</small>
                </div>
              </Link>
            </div>

            {/* Quick Role Switcher Pill Navigation */}
            <div className="mb-4">
              <div 
                className="d-flex p-1 rounded-4 shadow-sm bg-white border" 
                style={{ borderColor: '#e2e8f0', gap: '4px' }}
              >
                {Object.entries(ROLE_CONFIGS).map(([key, cfg]) => {
                  const isActive = role === key;
                  return (
                    <Link
                      key={key}
                      to={cfg.path}
                      className={`btn flex-fill py-2 px-1 px-sm-2 rounded-3 text-decoration-none text-center fw-bold transition-all ${
                        isActive 
                          ? 'shadow-sm text-white' 
                          : 'text-muted hover-light'
                      }`}
                      style={{
                        fontSize: '12px',
                        background: isActive ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' : 'transparent',
                        border: 'none',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <i className={`fa ${cfg.icon} me-1 d-none d-sm-inline`}></i>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Main Auth Card */}
            <div 
              className="bg-white p-4 p-sm-5 rounded-4 shadow-sm border position-relative" 
              style={{ 
                borderColor: '#e2e8f0',
                boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.07)'
              }}
            >
              {/* Role Indicator Accent Pill */}
              <div className="text-center mb-4">
                <div 
                  className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 shadow-xs"
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  <i className={`fa ${currentRole.icon}`} style={{ color: currentRole.accentColor }}></i>
                  <span>{currentRole.label}</span>
                </div>

                <h2 className="fw-bold mb-2 text-dark" style={{ letterSpacing: '-0.5px' }}>{title}</h2>
                <p className="text-muted small mb-0">{subtitle || currentRole.tagline}</p>
              </div>

              {/* Form Content */}
              <div className="login-form-wrapper">
                {children}
              </div>

              {/* Card Footer: Back to Website & Security Notice */}
              <div className="pt-4 mt-4 border-top text-center" style={{ borderColor: '#f1f5f9' }}>
                <Link to="/" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1 hover-primary">
                  <i className="fa fa-arrow-left"></i>
                  <span>Back to Clinidea Website</span>
                </Link>
              </div>

            </div>

            {/* Copyright Note */}
            <div className="text-center mt-4">
              <small className="text-muted" style={{ fontSize: '11px' }}>
                &copy; {new Date().getFullYear()} Clinidea Education LMS. All Rights Reserved. Protected by anti-copy DRM.
              </small>
            </div>

          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .auth-root-wrapper input.form-control {
          background-color: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          font-size: 15px !important;
          color: #1e293b !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-root-wrapper input.form-control:focus {
          background-color: #ffffff !important;
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15) !important;
        }
        .auth-root-wrapper .input-group-text {
          background-color: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
          color: #64748b !important;
          border-radius: 12px !important;
        }
        .auth-root-wrapper .btn-auth-submit {
          border-radius: 12px !important;
          padding: 14px 20px !important;
          font-weight: 700 !important;
          font-size: 16px !important;
          letter-spacing: -0.2px !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: none !important;
        }
        .auth-root-wrapper .btn-auth-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.35) !important;
        }
        .auth-root-wrapper .btn-auth-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .hover-light:hover {
          background: #f1f5f9 !important;
          color: #1e293b !important;
        }
        .hover-primary:hover {
          color: #4f46e5 !important;
        }
      `}} />
    </div>
  );
};

export default AuthLayout;

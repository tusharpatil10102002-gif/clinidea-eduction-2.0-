import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../admin.css';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const adminRole = localStorage.getItem('adminRole') || 'superadmin';

  return (
    <>
      <div className={`admin-sidebar p-3 p-lg-4 d-flex flex-column ${mobileOpen ? 'show' : ''}`}>
        <div className="d-flex align-items-center justify-content-between mb-4 mt-2 px-2">
          <span className="admin-sidebar-brand fs-4 fw-bold">Clinidea Admin</span>
          {/* Mobile close button inside sidebar */}
          <button className="btn d-lg-none text-white border-0" onClick={() => setMobileOpen(false)}>
            <i className="fa fa-times fa-lg"></i>
          </button>
        </div>
      <hr className="mt-0 mb-4 border-light opacity-10" />
      <ul className="nav nav-pills flex-column mb-auto gap-2">
        {adminRole !== 'mentor' && (
          <>
            <li className="nav-item">
              <Link to="/admin/dashboard" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/dashboard')}`}>
                <span className="fa fa-home me-2"></span> Dashboard
              </Link>
            </li>
            
            <h6 className="px-3 mt-3 text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.70rem', letterSpacing: '1px' }}>1. Pre-Admission</h6>
            <li className="nav-item">
              <Link to="/admin/leads" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/leads')}`}>
                <span className="fa fa-phone me-2"></span> Student Enquiries
              </Link>
            </li>
            {adminRole !== 'lead_manager' && (
              <li className="nav-item">
                <Link to="/admin/users" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/users')}`}>
                  <span className="fa fa-user-plus me-2"></span> Registered Users
                </Link>
              </li>
            )}
            {adminRole === 'lead_manager' && (
              <li className="nav-item">
                <Link to="/admin/events" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/events')}`}>
                  <span className="fa fa-calendar-alt me-2"></span> Events
                </Link>
              </li>
            )}
          </>
        )}

        {adminRole === 'mentor' && (
          <>
            <h6 className="px-3 mt-3 text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.70rem', letterSpacing: '1px' }}>Mentor Panel</h6>
            <li className="nav-item">
              <Link to="/admin/lms" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/lms')}`}>
                <span className="fab fa-google-drive me-2 text-success"></span> LMS & Drive
              </Link>
            </li>
          </>
        )}
        
        {adminRole !== 'lead_manager' && adminRole !== 'mentor' && (
          <>
            <h6 className="px-3 mt-3 text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.70rem', letterSpacing: '1px' }}>2. Academics</h6>
            <li className="nav-item">
              <Link to="/admin/enrollments" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/enrollments')}`}>
                <span className="fa fa-check-circle me-2"></span> Enrollments
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/students" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/students')}`}>
                <span className="fa fa-user-graduate me-2"></span> Student CRM
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/batches" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/batches')}`}>
                <span className="fa fa-layer-group me-2"></span> Batches & Mentors
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/lms" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/lms')}`}>
                <span className="fab fa-google-drive me-2 text-success"></span> LMS & Drive
              </Link>
            </li>

            <h6 className="px-3 mt-3 text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.70rem', letterSpacing: '1px' }}>3. Placements & HR</h6>
            <li className="nav-item">
              <Link to="/admin/hr-database" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/hr-database')}`}>
                <span className="fa fa-address-book me-2"></span> HR Database (CVs)
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/hr-campaigns" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/hr-campaigns')}`}>
                <span className="fa fa-envelope-open-text me-2"></span> Email Campaigns
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/hr-email-accounts" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/hr-email-accounts')}`}>
                <span className="fa fa-at me-2"></span> Email Accounts
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/placements" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/placements')}`}>
                <span className="fa fa-trophy me-2"></span> Placement Records
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/testimonials" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/testimonials')}`}>
                <span className="fa fa-star me-2 text-warning"></span> Student Reviews
              </Link>
            </li>

            <h6 className="px-3 mt-3 text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.70rem', letterSpacing: '1px' }}>4. Master Data & Settings</h6>
            <li className="nav-item">
              <Link to="/admin/courses" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/courses')}`}>
                <span className="fa fa-laptop-code me-2"></span> Course Master
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/finance" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/finance')}`}>
                <span className="fa fa-chart-line me-2"></span> Finance
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/events" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/events')}`}>
                <span className="fa fa-calendar-alt me-2"></span> Events
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/blogs" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/blogs')}`}>
                <span className="fa fa-blog me-2"></span> Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/coupons" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/coupons')}`}>
                <span className="fa fa-tags me-2"></span> Coupons
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/cms" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/cms')}`}>
                <span className="fa fa-file-alt me-2"></span> Settings & CMS
              </Link>
            </li>
          </>
        )}
      </ul>
      <hr className="border-light opacity-10" />
      <button onClick={handleLogout} className="btn btn-outline-light py-2 fw-bold w-100" style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span className="fa fa-sign-out me-2"></span> Logout
      </button>
    </div>
    {/* Mobile Overlay */}
    {mobileOpen && (
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none" 
        style={{ zIndex: 1040 }}
        onClick={() => setMobileOpen(false)}
      ></div>
    )}
    </>
  );
};

export default AdminSidebar;

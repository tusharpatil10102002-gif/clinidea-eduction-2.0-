import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../admin.css';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [websiteMgmtOpen, setWebsiteMgmtOpen] = useState(
    ['/admin/courses', '/admin/review-videos', '/admin/testimonials', '/admin/placements', '/admin/events'].includes(location.pathname)
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <div className={`admin-sidebar p-3 p-lg-4 d-flex flex-column ${mobileOpen ? 'show' : ''}`}>
        <div className="d-flex align-items-center justify-content-between mb-4 mt-2 px-2">
          <span className="admin-sidebar-brand fs-4 fw-bold text-white">Clinidea Admin</span>
          <button className="btn d-lg-none text-white border-0" onClick={() => setMobileOpen(false)}>
            <i className="fa fa-times fa-lg"></i>
          </button>
        </div>

        <hr className="mt-0 mb-3 border-light opacity-10" />

        <ul className="nav nav-pills flex-column mb-auto gap-1">
          {/* Dashboard */}
          <li className="nav-item mb-1">
            <Link to="/admin/dashboard" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/dashboard')}`}>
              <span className="fa fa-home me-2"></span> Dashboard
            </Link>
          </li>

          {/* 1. Website Management Dropdown */}
          <li className="nav-item">
            <button 
              className={`nav-link p-3 rounded-3 fw-bold w-100 d-flex align-items-center justify-content-between text-start border-0 ${websiteMgmtOpen ? 'bg-white bg-opacity-10 text-white' : ''}`}
              onClick={() => setWebsiteMgmtOpen(!websiteMgmtOpen)}
              style={{ background: 'transparent' }}
            >
              <span><i className="fas fa-globe me-2 text-info"></i> Website Management</span>
              <i className={`fas fa-chevron-${websiteMgmtOpen ? 'up' : 'down'} small`}></i>
            </button>

            {websiteMgmtOpen && (
              <div className="ps-3 pe-1 py-1 d-flex flex-column gap-1 my-1 border-start border-white border-opacity-25 ms-3">
                <Link to="/admin/courses" className={`nav-link py-2 px-3 rounded-2 text-white-50 fw-semibold ${isActive('/admin/courses')}`}>
                  • Course Master
                </Link>
                <Link to="/admin/review-videos" className={`nav-link py-2 px-3 rounded-2 text-white-50 fw-semibold ${isActive('/admin/review-videos')}`}>
                  • Review Videos
                </Link>
                <Link to="/admin/testimonials" className={`nav-link py-2 px-3 rounded-2 text-white-50 fw-semibold ${isActive('/admin/testimonials')}`}>
                  • Student Reviews
                </Link>
                <Link to="/admin/placements" className={`nav-link py-2 px-3 rounded-2 text-white-50 fw-semibold ${isActive('/admin/placements')}`}>
                  • Placement Records
                </Link>
                <Link to="/admin/events" className={`nav-link py-2 px-3 rounded-2 text-white-50 fw-semibold ${isActive('/admin/events')}`}>
                  • Events
                </Link>
              </div>
            )}
          </li>

          {/* 2. Register Students */}
          <li className="nav-item">
            <Link to="/admin/users" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/users')}`}>
              <span className="fa fa-user-plus me-2 text-success"></span> Register Students
            </Link>
          </li>

          {/* 3. Batch Management */}
          <li className="nav-item">
            <Link to="/admin/batches" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/batches')}`}>
              <span className="fa fa-layer-group me-2 text-warning"></span> Batch Management
            </Link>
          </li>

          {/* 4. Placement Management */}
          <li className="nav-item">
            <Link to="/admin/placements" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/placements')}`}>
              <span className="fa fa-trophy me-2 text-warning"></span> Placement Management
            </Link>
          </li>

          {/* 5. Mentor Management */}
          <li className="nav-item">
            <Link to="/admin/mentor-management" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/mentor-management')}`}>
              <span className="fa fa-chalkboard-teacher me-2 text-info"></span> Mentor Management
            </Link>
          </li>

          {/* 6. Student Coordinator Management */}
          <li className="nav-item">
            <Link to="/admin/coordinator-management" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/coordinator-management')}`}>
              <span className="fa fa-user-tie me-2 text-primary"></span> Student Coordinator Management
            </Link>
          </li>

          {/* 7. Reports */}
          <li className="nav-item">
            <Link to="/admin/reports" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/reports')}`}>
              <span className="fa fa-chart-pie me-2 text-success"></span> Reports
            </Link>
          </li>

          {/* 8. Fees Management */}
          <li className="nav-item">
            <Link to="/admin/finance" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/finance')}`}>
              <span className="fa fa-wallet me-2 text-success"></span> Fees Management
            </Link>
          </li>

          {/* 9. Certificate Management */}
          <li className="nav-item">
            <Link to="/admin/certificates" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/certificates')}`}>
              <span className="fa fa-certificate me-2 text-warning"></span> Certificate Management
            </Link>
          </li>

          {/* 10. Role Credential Management */}
          <li className="nav-item">
            <Link to="/admin/roles" className={`nav-link p-3 rounded-3 fw-bold ${isActive('/admin/roles')}`}>
              <span className="fa fa-users-cog me-2 text-danger"></span> Role Credential Management
            </Link>
          </li>
        </ul>

        <hr className="border-light opacity-10 my-3" />
        
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
        />
      )}
    </>
  );
};

export default AdminSidebar;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalLeads: 0, leadsToday: 0, recentLeads: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminRole = localStorage.getItem('adminRole');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    if (adminRole === 'mentor') {
      navigate('/admin/lms');
      return;
    }
    
    const url = `${BASE_URL}/api/admin/dashboard`;
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') {
          console.error("Dashboard fetch error:", err);
          setLoading(false);
        }
      });
  }, [navigate]);

  if (loading) return <div className="d-flex justify-content-center mt-5">Loading...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex align-items-center mb-4">
          <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
            <i className="fa fa-bars"></i>
          </button>
          <h2 className="mb-0 fw-bold" style={{ color: 'var(--admin-primary)', letterSpacing: '-0.5px' }}>Dashboard Overview</h2>
        </div>
        
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <div className="card finance-stat-card border-0 p-4 text-white h-100" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)', borderRadius: '24px' }}>
              <i className="fa fa-users finance-icon-bg"></i>
              <h5 className="finance-stat-title">Total Leads</h5>
              <h1 className="finance-stat-value mb-0 mt-2">{stats.totalLeads}</h1>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card finance-stat-card border-0 p-4 text-white h-100" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #164E63 100%)', borderRadius: '24px' }}>
              <i className="fa fa-chart-line finance-icon-bg"></i>
              <h5 className="finance-stat-title">Leads Added Today</h5>
              <h1 className="finance-stat-value mb-0 mt-2">{stats.leadsToday}</h1>
            </div>
          </div>
        </div>

        <div className="modern-table-card bg-white">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold" style={{ color: 'var(--admin-primary)' }}>Recent 5 Incoming Leads</h5>
            <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" onClick={() => navigate('/admin/leads')}>View All</button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course Interest</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLeads.map(lead => (
                    <tr key={lead.id}>
                      <td className="text-muted fw-medium">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="fw-bold" style={{ color: 'var(--admin-primary)' }}>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td><span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' }}>{lead.course_interest}</span></td>
                      <td>
                        <span className={`badge ${lead.status === 'New' ? 'bg-primary' : 'bg-success'}`} style={{ padding: '0.6em 1em', borderRadius: '8px' }}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stats.recentLeads.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-5 text-muted">No recent leads found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

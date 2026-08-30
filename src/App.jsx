import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

const safeLazy = (importFn) => {
  return lazy(() => 
    importFn().catch((err) => {
      console.warn("Lazy import failed, auto-retrying reload:", err);
      const pageHasBeenReloaded = sessionStorage.getItem('page_lazy_reloaded');
      if (!pageHasBeenReloaded) {
        sessionStorage.setItem('page_lazy_reloaded', 'true');
        window.location.reload();
      }
      return Promise.reject(err);
    })
  );
};

const About = safeLazy(() => import('./pages/About'));
const ClinicalResearchCrPvDm = safeLazy(() => import('./pages/ClinicalResearchCrPvDm'));
const ClinicalResearchMedicalWriting = safeLazy(() => import('./pages/ClinicalResearchMedicalWriting'));
const ClinicalResearchPharmacovigilance = safeLazy(() => import('./pages/ClinicalResearchPharmacovigilance'));
const ClinicalResearchRegulatoryAffairs = safeLazy(() => import('./pages/ClinicalResearchRegulatoryAffairs'));
const Contact = safeLazy(() => import('./pages/Contact'));
const ClinicalResearchDataManagement = safeLazy(() => import('./pages/ClinicalResearchDataManagement'));
const ClinicalResearchMedicalCoding = safeLazy(() => import('./pages/ClinicalResearchMedicalCoding'));
const HomePage = safeLazy(() => import('./pages/HomePage'));
const Program = safeLazy(() => import('./pages/Program'));
const ThankYou = safeLazy(() => import('./pages/ThankYou'));
const AdminLogin = safeLazy(() => import('./pages/AdminLogin'));
const AdminDashboard = safeLazy(() => import('./pages/AdminDashboard'));
const AdminLeads = safeLazy(() => import('./pages/AdminLeads'));
const AdminUsers = safeLazy(() => import('./pages/AdminUsers'));
const AdminStudents = safeLazy(() => import('./pages/AdminStudents'));
const AdminCourses = safeLazy(() => import('./pages/AdminCourses'));
const AdminBatches = safeLazy(() => import('./pages/AdminBatches'));
const AdminSessions = safeLazy(() => import('./pages/AdminSessions'));
const AdminEnrollments = safeLazy(() => import('./pages/AdminEnrollments'));
const AdminEvents = safeLazy(() => import('./pages/AdminEvents'));
const AdminFinance = safeLazy(() => import('./pages/AdminFinance'));
const AdminBlogs = safeLazy(() => import('./pages/AdminBlogs'));
const AdminTestimonials = safeLazy(() => import('./pages/AdminTestimonials'));
const AdminPlacements = safeLazy(() => import('./pages/AdminPlacements'));
const AdminReviewVideos = safeLazy(() => import('./pages/AdminReviewVideos'));
const AdminCMS = safeLazy(() => import('./pages/AdminCMS'));
const AdminHREmailAccounts = safeLazy(() => import('./pages/AdminHREmailAccounts'));
const AdminHRDatabase = safeLazy(() => import('./pages/AdminHRDatabase'));
const AdminHRCampaigns = safeLazy(() => import('./pages/AdminHRCampaigns'));
const AdminHRCampaignDetail = safeLazy(() => import('./pages/AdminHRCampaignDetail'));
const AdminLMS = safeLazy(() => import('./pages/AdminLMS'));
const AdminRoleManagement = safeLazy(() => import('./pages/AdminRoleManagement'));
const AdminStudentManagement = safeLazy(() => import('./pages/AdminStudentManagement'));
const AdminMentorManagement = safeLazy(() => import('./pages/AdminMentorManagement'));
const AdminCoordinatorManagement = safeLazy(() => import('./pages/AdminCoordinatorManagement'));
const AdminReports = safeLazy(() => import('./pages/AdminReports'));
const AdminCertificates = safeLazy(() => import('./pages/AdminCertificates'));
const StudentLMS = safeLazy(() => import('./pages/StudentLMS'));
const Register = safeLazy(() => import('./pages/Register'));
const Login = safeLazy(() => import('./pages/Login'));
const StudentDashboard = safeLazy(() => import('./pages/StudentDashboard'));
const ContentPlayer = safeLazy(() => import('./pages/ContentPlayer'));
const EnrollmentForm = safeLazy(() => import('./pages/EnrollmentForm'));
const MentorLogin = safeLazy(() => import('./pages/MentorLogin'));
const MentorDashboard = safeLazy(() => import('./pages/MentorDashboard'));
const CoordinatorLogin = safeLazy(() => import('./pages/CoordinatorLogin'));
const CoordinatorDashboard = safeLazy(() => import('./pages/CoordinatorDashboard'));
const Unauthorized = safeLazy(() => import('./pages/Unauthorized'));
const ForgotPassword = safeLazy(() => import('./pages/ForgotPassword'));
const ResetPassword = safeLazy(() => import('./pages/ResetPassword'));
const CertificateVerification = safeLazy(() => import('./pages/CertificateVerification'));

const Events = safeLazy(() => import('./pages/Events'));
const TakeQuiz = safeLazy(() => import('./pages/TakeQuiz'));
const Blogs = safeLazy(() => import('./pages/Blogs'));
const BlogDetail = safeLazy(() => import('./pages/BlogDetail'));
const PlacementsPage = safeLazy(() => import('./pages/PlacementsPage'));

const RegisterInstructions = safeLazy(() => import('./pages/RegisterInstructions'));

import ScrollToTop from './components/ScrollToTop';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MentorRoute from './components/MentorRoute';
import CoordinatorRoute from './components/CoordinatorRoute';
import GlobalPopups from './components/GlobalPopups';
import Layout from './components/Layout';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#e11d48' }}>Something went wrong while loading this page.</h2>
          <p style={{ color: '#64748b' }}>{this.state.error?.message || 'Please refresh the page.'}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontSize:'1.5rem',color:'#667eea',fontFamily:'sans-serif'}}>Loading Clinical Programs...</div>}>
            <GlobalPopups />
            <Layout>
          <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/clinical-research-cr-pv-dm-course" element={<ClinicalResearchCrPvDm />} />
          <Route path="/clinical-research-medical-writing-course" element={<ClinicalResearchMedicalWriting />} />
          <Route path="/clinical-research-pharmacovigilance-course" element={<ClinicalResearchPharmacovigilance />} />
          <Route path="/clinical-research-regulatory-affairs-course" element={<ClinicalResearchRegulatoryAffairs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/clinical-research-data-management-course" element={<ClinicalResearchDataManagement />} />
          <Route path="/clinical-research-medical-coding-course" element={<ClinicalResearchMedicalCoding />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/index" element={<HomePage />} />
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/program" element={<Program />} />
          <Route path="/thank-you" element={<ThankYou />} />

          <Route path="/events" element={<Events />} />
          <Route path="/take-quiz/:id" element={<TakeQuiz />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/placements" element={<PlacementsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/Login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/leads" element={<AdminRoute><AdminLeads /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/students-management" element={<AdminRoute><AdminStudentManagement /></AdminRoute>} />
          <Route path="/admin/students" element={<AdminRoute><AdminStudents /></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
          <Route path="/admin/batches" element={<AdminRoute><AdminBatches /></AdminRoute>} />
          <Route path="/admin/sessions" element={<Navigate to="/admin/lms" replace />} />
          <Route path="/admin/enrollments" element={<AdminRoute><AdminEnrollments /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
          <Route path="/admin/finance" element={<AdminRoute><AdminFinance /></AdminRoute>} />
          <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />
          <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />
          <Route path="/admin/placements" element={<AdminRoute><AdminPlacements /></AdminRoute>} />
          <Route path="/admin/review-videos" element={<AdminRoute><AdminReviewVideos /></AdminRoute>} />
          <Route path="/admin/cms" element={<AdminRoute><AdminCMS /></AdminRoute>} />
          <Route path="/admin/hr-email-accounts" element={<AdminRoute><AdminHREmailAccounts /></AdminRoute>} />
          <Route path="/admin/hr-database" element={<AdminRoute><AdminHRDatabase /></AdminRoute>} />
          <Route path="/admin/hr-campaigns" element={<AdminRoute><AdminHRCampaigns /></AdminRoute>} />
          <Route path="/admin/hr-campaigns/:id" element={<AdminRoute><AdminHRCampaignDetail /></AdminRoute>} />
          <Route path="/admin/lms" element={<AdminRoute><AdminLMS /></AdminRoute>} />
          <Route path="/admin/roles" element={<AdminRoute><AdminRoleManagement /></AdminRoute>} />
          <Route path="/admin/mentor-management" element={<AdminRoute><AdminMentorManagement /></AdminRoute>} />
          <Route path="/admin/coordinator-management" element={<AdminRoute><AdminCoordinatorManagement /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
          <Route path="/admin/certificates" element={<AdminRoute><AdminCertificates /></AdminRoute>} />
          
          <Route path="/mentor/login" element={<MentorLogin />} />
          <Route path="/mentor/Login" element={<MentorLogin />} />
          <Route path="/mentor/dashboard" element={<MentorRoute><MentorDashboard /></MentorRoute>} />
          
          <Route path="/studentcoordinator/login" element={<CoordinatorLogin />} />
          <Route path="/studentcoordinator/Login" element={<CoordinatorLogin />} />
          <Route path="/studentcoordinator/dashboard" element={<CoordinatorRoute><CoordinatorDashboard /></CoordinatorRoute>} />

          <Route path="/certificate/verify/:certificateId" element={<CertificateVerification />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/student/lms" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/Login" element={<Login />} />
          <Route path="/student/login" element={<Login />} />
          <Route path="/register-instructions" element={<ProtectedRoute><RegisterInstructions /></ProtectedRoute>} />
          <Route path="/enroll" element={<ProtectedRoute><EnrollmentForm /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/watch" element={<ProtectedRoute><ContentPlayer /></ProtectedRoute>} />
        </Routes>
        </Layout>
      </Suspense>
      </ErrorBoundary>
      </Router>
    </HelmetProvider>
  );
}

export default App;

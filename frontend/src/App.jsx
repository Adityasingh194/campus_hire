import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layout
import DashboardLayout from './pages/DashboardLayout';

// Public pages
import LandingPage   from './pages/LandingPage';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';

// Student pages
import StudentDashboard    from './pages/student/StudentDashboard';
import JobListPage         from './pages/student/JobListPage';
import JobDetailPage       from './pages/student/JobDetailPage';
import MyApplicationsPage  from './pages/student/MyApplicationsPage';
import ProfilePage         from './pages/student/ProfilePage';

// Recruiter pages
import RecruiterDashboard  from './pages/recruiter/RecruiterDashboard';
import CompanyPage         from './pages/recruiter/CompanyPage';
import MyJobsPage          from './pages/recruiter/MyJobsPage';
import PostJobPage         from './pages/recruiter/PostJobPage';
import ApplicantsPage      from './pages/recruiter/ApplicantsPage';
import StudentBrowserPage  from './pages/recruiter/StudentBrowserPage';

// Admin pages
import AdminDashboard    from './pages/admin/AdminDashboard';
import CompaniesPage     from './pages/admin/CompaniesPage';
import ApplicationsPage  from './pages/admin/ApplicationsPage';
import UsersPage         from './pages/admin/UsersPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student dashboard */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="jobs"              element={<JobListPage />} />
            <Route path="jobs/:id"          element={<JobDetailPage />} />
            <Route path="applications"      element={<MyApplicationsPage />} />
            <Route path="profile"           element={<ProfilePage />} />
          </Route>

          {/* Recruiter dashboard */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RecruiterDashboard />} />
            <Route path="company"             element={<CompanyPage />} />
            <Route path="jobs"                element={<MyJobsPage />} />
            <Route path="jobs/new"            element={<PostJobPage />} />
            <Route path="jobs/:id/applicants" element={<ApplicantsPage />} />
            <Route path="students"            element={<StudentBrowserPage />} />
          </Route>

          {/* Admin dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="companies"   element={<CompaniesPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="users"       element={<UsersPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

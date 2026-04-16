import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = { student: '/student', recruiter: '/recruiter', admin: '/admin' };
    return <Navigate to={redirectMap[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;

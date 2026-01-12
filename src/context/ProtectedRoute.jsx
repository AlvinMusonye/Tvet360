import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
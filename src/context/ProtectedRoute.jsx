// src/context/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;  // Redirect to login if not authenticated
  }

  // Check if user has required permissions
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every(permission => 
      currentUser.permissions?.includes(permission)
    );
    
    if (!hasPermission) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
};

export default ProtectedRoute;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8360';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
     const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    username: formData.username.trim(), // Ensure no extra whitespace
    password: formData.password
  }),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Debug log the response
      console.log('Login response:', data);

      // Prepare user data with proper null checks
      const userData = {
        token: data.token || data.accessToken, // Handle both token and accessToken
        username: data.user?.username || data.details?.username || data.email, // Handle different response structures
        role: data.user?.role || data.details?.userRole || data.role, // Handle different response structures
        institution: data.user?.institutionId || data.details?.userInstitution || null,
        email: data.user?.email || data.details?.userEmail || data.email
      };

      if (!userData.username) {
        throw new Error('Invalid user data received from server');
      }

      // Call login with rememberMe flag
      login(userData, formData.rememberMe);

      // Redirect based on role
      const userRole = userData.role?.toUpperCase();
      
      switch(userRole) {
        case 'MINISTRY_OF_EDUCATION_ADMIN':
        case 'MOE_ADMIN': // Handle different role naming
          navigate('/moe');
          break;
        case 'INSTITUTION_ADMIN':
          navigate('/institution');
          break;
        case 'SP_ADMIN':
          navigate('/sp');
          break;
        default:
          console.warn('Unknown role, redirecting to default dashboard');
          navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-muted px-4 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-medium">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h2 className="heading-2 mb-3 text-primary">Welcome Back</h2>
          <p className="body-small text-text-muted">Enter your credentials to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="block text-sm font-medium text-text-muted mb-1">
              Username
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
                className="form-input w-full border border-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-text-muted">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input w-full border border-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center">
            <input
              id="remember"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-text-muted cursor-pointer">
              Remember this device
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              isLoading ? 'bg-primary-light' : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In to TVET360'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const user = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (userData, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
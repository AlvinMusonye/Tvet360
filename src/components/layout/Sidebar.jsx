// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { navigationItems } from './navigation';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get the first two path segments to handle nested routes like /institution/students
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPath = pathSegments[0] || 'moe';
  const isActive = (path) => {
    // Match exact path or nested path
    return location.pathname === path || 
           (path !== `/${currentPath}` && location.pathname.startsWith(`${path}/`));
  };
  const currentNavItems = navigationItems[currentPath] || navigationItems.moe;

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // Clear auth state, tokens, etc.
    localStorage.removeItem('authToken'); // If you're using tokens
    // Then redirect to login
    navigate('/');
  };

  return (
    <div className="w-64 bg-[var(--color-bg-muted)] h-full flex flex-col border-r border-[var(--color-border)]">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-3">
        <img 
          src="/tvet360.jpeg" 
          alt="TVET360 Logo" 
          className="h-10 w-10 rounded-md object-cover"
        />
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">TVET360</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {currentNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path) || location.pathname === item.path
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:bg-opacity-10'
                }`}
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-[var(--color-border)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
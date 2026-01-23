// src/components/Layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';  // This is correct since the file is in the same directory
const Layout = () => {
  return (
    <div className="flex  h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1  overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
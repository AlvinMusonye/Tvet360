// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Moe from './Dashboards/Moe';
import Sp from './Dashboards/Sp';
import Institution from './Dashboards/Institution';
import Students from './institution/Students';
import Layout from './components/layout/Layout'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/moe" element={<Moe />} />
          <Route path="/sp" element={<Sp />} />
          <Route path="/institution" element={<Institution />} />
          <Route path="/institution/students" element={<Students />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
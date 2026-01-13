// src/App.jsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Moe from './Dashboards/Moe';
import Sp from './Dashboards/Sp';
import Institution from './Dashboards/Institution';
import Students from './institution/Students';
import Staff from './institution/Staff';
import Programs from './institution/Programs';
import Reports from './institution/Reports';
import Infrastructure from './institution/Infrastructure';
import FinancialManagement from './institution/FinancialManagement';
import Layout from './components/layout/Layout'; 
import MoeInstitution from './moe/MoeInstitution';
import Equity from './moe/Equity';
import Employment from './moe/Employment';
import MoeReports from './moe/MoeReports';
import InstitutionReports from './institution/InstitutionReports';
import MoeAudit from './moe/MoeAudit';
import InstitutionAudit from './institution/InstitutionAudit';
import UserManagement from './moe/UserManagement';
import Setting from './components/Setting'
import MoeStudents from './moe/MoeStudents';


function App() {
  return (
  <AuthProvider>

    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
        <Route path="/moe" element={
          <ProtectedRoute requiredRole="MINISTRY_OF_EDUCATION_ADMIN">
            <Moe />
          </ProtectedRoute>
  } />          
          <Route path="/moe/institutions" element={<MoeInstitution />} />
          <Route path="/moe/equity" element={<Equity />} />
          <Route path="/moe/employment" element={<Employment />} />
          <Route path="/moe/reports" element={<MoeReports />} />
          <Route path="/moe/audit" element={<MoeAudit />} />
          <Route path='/moe/students' element={<MoeStudents />} />
<Route 
  path="/moe/users" 
  element={
    <ProtectedRoute requiredPermissions={['users']}>
      <UserManagement />
    </ProtectedRoute>
  } 
/>



        <Route path="/sp" element={
            <ProtectedRoute requiredRole="SP_ADMIN">
              <Sp />
            </ProtectedRoute>
          } />  
          <Route path="/institution" element={
            <ProtectedRoute requiredRole="INSTITUTION_ADMIN">
              <Institution />
            </ProtectedRoute>
          } />     
       <Route path="/institution/students" element={<Students />} />
          <Route path="/institution/staff" element={<Staff />} />
          <Route path="/institution/programs" element={<Programs />} />
          <Route path="/institution/reports" element={<Reports />} />
          <Route path="/institution/infrastructure" element={<Infrastructure />} />
          <Route path="/institution/financial" element={<FinancialManagement />} />
          <Route path="/institution/reports" element={<InstitutionReports />} />
          <Route path="/institution/audit" element={<InstitutionAudit />} />
        <Route path="/settings" element={
  <ProtectedRoute>
    <Setting />
  </ProtectedRoute>
} />

        </Route>

      </Routes>
    </Router>
  </AuthProvider>

  );
}

export default App;
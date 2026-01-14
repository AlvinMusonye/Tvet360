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
import FinancialManagement from './moe/FinancialManagement';


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
          <Route path="/moe/institutions" element={
            <ProtectedRoute requiredRole="MINISTRY_OF_EDUCATION_ADMIN">
              <MoeInstitution />
            </ProtectedRoute>
          } />
          <Route path="/moe/equity" element={
            <ProtectedRoute requiredRole="MINISTRY_OF_EDUCATION_ADMIN">
              <Equity />
            </ProtectedRoute>
          } />
          <Route path="/moe/employment" element={
            <ProtectedRoute requiredRole="MINISTRY_OF_EDUCATION_ADMIN">
              <Employment />
            </ProtectedRoute>
          } />
          <Route path="/moe/reports" element={
            <ProtectedRoute requiredRole="MINISTRY_OF_EDUCATION_ADMIN">
              <MoeReports />
            </ProtectedRoute>
          } />
          <Route path="/moe/audit" element={
            <ProtectedRoute requiredRole="MINISTRY_OF_EDUCATION_ADMIN">
              <MoeAudit />
            </ProtectedRoute>
          } />
          <Route path='/moe/students' element={
            <ProtectedRoute requiredRole="MINISTRY_OF_EDUCATION_ADMIN">
              <MoeStudents />
            </ProtectedRoute>
          } />
          <Route path='/moe/financial' element={
            <ProtectedRoute requiredRole="MINISTRY_OF_EDUCATION_ADMIN">
              <FinancialManagement />
            </ProtectedRoute>
          } />
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
          <Route path="/institution/students" element={
            <ProtectedRoute requiredRole="INSTITUTION_ADMIN">
              <Students />
            </ProtectedRoute>
          } />
          <Route path="/institution/staff" element={
            <ProtectedRoute requiredRole="INSTITUTION_ADMIN">
              <Staff />
            </ProtectedRoute>
          } />
          <Route path="/institution/programs" element={
            <ProtectedRoute requiredRole="INSTITUTION_ADMIN">
              <Programs />
            </ProtectedRoute>
          } />
          <Route path="/institution/reports" element={
            <ProtectedRoute requiredRole="INSTITUTION_ADMIN">
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/institution/infrastructure" element={
            <ProtectedRoute requiredRole="INSTITUTION_ADMIN">
              <Infrastructure />
            </ProtectedRoute>
          } />
          <Route path="/institution/reports-dashboard" element={
            <ProtectedRoute requiredRole="INSTITUTION_ADMIN">
              <InstitutionReports />
            </ProtectedRoute>
          } />
          <Route path="/institution/audit" element={
            <ProtectedRoute requiredRole="INSTITUTION_ADMIN">
              <InstitutionAudit />
            </ProtectedRoute>
          } />
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
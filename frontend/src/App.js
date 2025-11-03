import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DriverPortal from './pages/DriverPortal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/driver" element={<DriverPortal />} />
          <Route path="/admin/login" element={<AdminLogin setAuth={setIsAdminAuthenticated} />} />
          <Route 
            path="/admin/dashboard" 
            element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StaffList from './components/Staff/StaffList';
import AttendanceDashboard from './components/Attendance/AttendanceDashboard';
import TaskList from './components/Tasks/TaskList';
import LeaveDashboard from './components/Leaves/LeaveDashboard';
import ExpenseDashboard from './components/Expenses/ExpenseDashboard';
import ClientList from './components/Clients/ClientList';
import ProductCatalog from './components/Products/ProductCatalog';
import Layout from './components/Layout';
import './App.css';
import './components/Modal.css';

function App() {
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));

  const handleLogin = (role: string) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!userRole ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/"
          element={userRole ? <Layout userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/login" />}
        >
          <Route path="dashboard" element={<Dashboard userRole={userRole!} />} />
          <Route path="staff" element={<StaffList />} />
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="leaves" element={<LeaveDashboard />} />
          <Route path="expenses" element={<ExpenseDashboard />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="products" element={<ProductCatalog userRole={userRole!} />} />
          {/* Fallback to dashboard for now */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

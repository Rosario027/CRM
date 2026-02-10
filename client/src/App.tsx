import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogin = (role: string) => {
    setUserRole(role);
    // In a real app, we would save token to localStorage here
  };

  const handleLogout = () => {
    setUserRole(null);
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
          {/* Fallback to dashboard for now */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

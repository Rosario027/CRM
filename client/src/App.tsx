import { useState } from 'react';
import Login from './components/Login';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogin = (role: string) => {
    setUserRole(role);
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {userRole === 'admin' ? 'Administrator' : 'Employee'}</h1>
      <p>This is the main dashboard.</p>
      <button onClick={() => setUserRole(null)}>Logout</button>
    </div>
  );
}

export default App;

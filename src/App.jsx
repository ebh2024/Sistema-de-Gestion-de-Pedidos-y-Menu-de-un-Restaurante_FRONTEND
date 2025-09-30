import { useState } from 'react';
import LoginRegister from './components/LoginRegister';
import AdminDashboard from './components/AdminDashboard';
import WaiterDashboard from './components/WaiterDashboard';
import CookDashboard from './components/CookDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    if (user.role === 'Admin') {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    } else if (user.role === 'Mesero') {
      return <WaiterDashboard user={user} onLogout={handleLogout} />;
    } else if (user.role === 'Cocinero') {
      return <CookDashboard user={user} onLogout={handleLogout} />;
    }
  }

  return <LoginRegister onLogin={handleLogin} />;
}

export default App

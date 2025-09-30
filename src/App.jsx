import { useState } from 'react';
import LoginRegister from './components/LoginRegister';
import AdminDashboard from './components/AdminDashboard';
import WaiterDashboard from './components/WaiterDashboard';
import CookDashboard from './components/CookDashboard';
import { DishProvider } from './components/DishContext';
import Snackbar from './components/Snackbar';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <DishProvider>
      {user ? (
        user.role === 'Admin' ? (
          <AdminDashboard user={user} onLogout={handleLogout} />
        ) : user.role === 'Mesero' ? (
          <WaiterDashboard user={user} onLogout={handleLogout} />
        ) : user.role === 'Cocinero' ? (
          <CookDashboard user={user} onLogout={handleLogout} />
        ) : (
          <LoginRegister onLogin={handleLogin} />
        )
      ) : (
        <LoginRegister onLogin={handleLogin} />
      )}
      <Snackbar />
    </DishProvider>
  );
}

export default App

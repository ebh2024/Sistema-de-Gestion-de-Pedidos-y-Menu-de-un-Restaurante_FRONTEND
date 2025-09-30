import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import WaiterDashboard from './components/WaiterDashboard';
import CookDashboard from './components/CookDashboard';
import { DishProvider } from './components/DishContext';
import { TableProvider } from './components/TableContext';
import { OrderProvider } from './components/OrderContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Snackbar from './components/Snackbar';

function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You could add a proper loading component here
  }

  // Handle routing logic to prevent redirect loops
  if (user) {
    // User is logged in, redirect to dashboard if not already there
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/login') {
      window.location.href = '/dashboard';
      return null;
    }

    // Render dashboard based on role
    if (user.role === 'Admin') {
      return (
        <DishProvider>
          <TableProvider>
            <OrderProvider>
              <AdminDashboard user={user} onLogout={logout} />
              <Snackbar />
            </OrderProvider>
          </TableProvider>
        </DishProvider>
      );
    } else if (user.role === 'Mesero') {
      return (
        <DishProvider>
          <TableProvider>
            <OrderProvider>
              <WaiterDashboard user={user} onLogout={logout} />
              <Snackbar />
            </OrderProvider>
          </TableProvider>
        </DishProvider>
      );
    } else if (user.role === 'Cocinero') {
      return (
        <DishProvider>
          <TableProvider>
            <OrderProvider>
              <CookDashboard user={user} onLogout={logout} />
              <Snackbar />
            </OrderProvider>
          </TableProvider>
        </DishProvider>
      );
    } else {
      // Invalid role, show error and don't render dashboard
      return <div>Invalid user role. Please contact administrator.</div>;
    }
  }

  // User is not logged in, show routing
  return (
    <DishProvider>
      <TableProvider>
        <OrderProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Snackbar />
        </OrderProvider>
      </TableProvider>
    </DishProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App

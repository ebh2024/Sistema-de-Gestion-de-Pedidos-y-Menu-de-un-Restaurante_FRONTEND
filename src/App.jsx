import LoginRegister from './components/LoginRegister';
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

  return (
    <DishProvider>
      <TableProvider>
        <OrderProvider>
          {user ? (
            user.role === 'Admin' ? (
              <AdminDashboard user={user} onLogout={logout} />
            ) : user.role === 'Mesero' ? (
              <WaiterDashboard user={user} onLogout={logout} />
            ) : user.role === 'Cocinero' ? (
              <CookDashboard user={user} onLogout={logout} />
            ) : (
              <LoginRegister />
            )
          ) : (
            <LoginRegister />
          )}
          <Snackbar />
        </OrderProvider>
      </TableProvider>
    </DishProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App

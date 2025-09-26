import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import MenuManagement from './components/MenuManagement';
import MenuView from './components/MenuView';
import TableManagement from './components/TableManagement';
import TableView from './components/TableView';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu-management"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MenuManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu-view"
              element={
                <ProtectedRoute allowedRoles={['mesero', 'cocinero']}>
                  <MenuView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/table-management"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TableManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/table-view"
              element={
                <ProtectedRoute allowedRoles={['mesero', 'cocinero']}>
                  <TableView />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

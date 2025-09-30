import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  Link,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function LoginRegister() {
  const { login, register, forgotPassword, resetPassword } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [mode, setMode] = useState('auth'); // 'auth', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [resetToken, setResetToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState(false);

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getRole = (email) => {
    if (email.toLowerCase().includes('admin')) return 'Admin';
    if (email.toLowerCase().includes('mesero')) return 'Mesero';
    if (email.toLowerCase().includes('cocinero')) return 'Cocinero';
    return 'Mesero'; // default
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMode('auth');
    setErrors({});
    setFormData({ email: '', password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    }
    if (tabValue === 1) { // Register
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmar contraseña es requerido';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    if (tabValue === 0) {
      // Login
      const result = await login(formData.email, formData.password);
      if (result.success) {
        showToast('Login exitoso');
      } else {
        showToast(result.error || 'Error en el login', 'error');
      }
    } else {
      // Register
      setConfirmDialog(true);
    }

    setIsSubmitting(false);
  };

  const handleConfirmRegister = async () => {
    setConfirmDialog(false);
    setIsSubmitting(true);

    const result = await register({
      username: formData.email.split('@')[0], // Use email prefix as username
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      showToast('Registro exitoso. Por favor inicia sesión.');
      setFormData({ email: '', password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '' });
      setTabValue(0); // Switch to login tab
    } else {
      showToast(result.error || 'Error en el registro', 'error');
    }

    setIsSubmitting(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email no es válido';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      const result = await forgotPassword(formData.email);
      if (result.success) {
        setResetToken('dummy-token-123'); // For demo purposes
        setMode('reset');
        showToast('Enlace de restablecimiento enviado a tu email');
        setFormData({ ...formData, email: '' });
      } else {
        showToast(result.error || 'Error al enviar el enlace', 'error');
      }
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = 'Nueva contraseña es requerida';
    }
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Confirmar nueva contraseña es requerido';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      const result = await resetPassword(resetToken, formData.newPassword);
      if (result.success) {
        showToast('Contraseña restablecida exitosamente');
        setMode('auth');
        setFormData({ email: '', password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        showToast(result.error || 'Error al restablecer contraseña', 'error');
      }
      setIsSubmitting(false);
    }
  };

  if (mode === 'auth') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sistema de Gestión
          </Typography>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="login register tabs">
            <Tab label="Iniciar Sesión" />
            <Tab label="Registrarse" />
          </Tabs>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
            />
            {tabValue === 1 && (
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                margin="normal"
                required
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{ mt: 3, mb: 2 }}
            >
              {tabValue === 0 ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
            {tabValue === 0 && (
              <Link
                component="button"
                variant="body2"
                onClick={() => setMode('forgot')}
                sx={{ display: 'block', textAlign: 'center', mt: 1 }}
              >
                Olvidé mi contraseña
              </Link>
            )}
          </Box>
        </Paper>
      </Box>
    );
  } else if (mode === 'forgot') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Recuperar Contraseña
          </Typography>
          <Box component="form" onSubmit={handleForgotSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{ mt: 3, mb: 2 }}
            >
              Enviar enlace de restablecimiento
            </Button>
            <Link
              component="button"
              variant="body2"
              onClick={() => setMode('auth')}
              sx={{ display: 'block', textAlign: 'center', mt: 1 }}
            >
              Volver
            </Link>
          </Box>
        </Paper>
      </Box>
    );
  } else if (mode === 'reset') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Restablecer Contraseña
          </Typography>
          <Box component="form" onSubmit={handleResetSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nueva Contraseña"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirmar Nueva Contraseña"
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{ mt: 3, mb: 2 }}
            >
              Restablecer Contraseña
            </Button>
            <Link
              component="button"
              variant="body2"
              onClick={() => setMode('auth')}
              sx={{ display: 'block', textAlign: 'center', mt: 1 }}
            >
              Volver
            </Link>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirmar Registro</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres registrarte con el email {formData.email}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmRegister} disabled={isSubmitting}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LoginRegister;

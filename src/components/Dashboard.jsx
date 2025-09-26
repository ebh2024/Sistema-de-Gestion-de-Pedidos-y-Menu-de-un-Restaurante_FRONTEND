import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Restaurant, MenuBook, TableChart, ShoppingCart, Logout, Edit, Visibility } from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleMenuAction = () => {
    if (user?.rol === 'admin') {
      navigate('/menu-management');
    } else if (user?.rol === 'mesero' || user?.rol === 'cocinero') {
      navigate('/menu-view');
    }
  };

  const handleTableAction = () => {
    if (user?.rol === 'admin') {
      navigate('/table-management');
    } else if (user?.rol === 'mesero' || user?.rol === 'cocinero') {
      navigate('/table-view');
    }
  };

  const handleOrderAction = () => {
    if (user?.rol === 'admin') {
      navigate('/order-management-admin');
    } else if (user?.rol === 'mesero') {
      navigate('/order-management');
    } else if (user?.rol === 'cocinero') {
      navigate('/order-view');
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Restaurant />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión de Restaurante
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Bienvenido, {user?.correo}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Panel de Control
          </Typography>
          <Typography variant="h6" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
            Gestiona tu restaurante desde aquí
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <MenuBook sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom>
                  Gestión de Menús
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.rol === 'admin' ? 'Crea y administra el menú de tu restaurante.' : 'Visualiza el menú disponible.'}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleMenuAction}
                  startIcon={user?.rol === 'admin' ? <Edit /> : <Visibility />}
                >
                  {user?.rol === 'admin' ? 'Gestionar Menú' : 'Ver Menú'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <ShoppingCart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom>
                  Pedidos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestiona pedidos en tiempo real.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleOrderAction}
                  startIcon={<Visibility />}
                >
                  {user?.rol === 'admin' ? 'Gestionar Pedidos' : user?.rol === 'mesero' ? 'Ver Mis Pedidos' : 'Ver Pedidos en Cocina'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <TableChart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom>
                  Mesas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Organiza y asigna mesas a los clientes.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleTableAction}
                  startIcon={user?.rol === 'admin' ? <Edit /> : <Visibility />}
                >
                  {user?.rol === 'admin' ? 'Gestionar Mesas' : 'Ver Mesas'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Restaurant sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom>
                  Reportes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Obtén informes detallados de tu negocio.
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Ver Reportes
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;

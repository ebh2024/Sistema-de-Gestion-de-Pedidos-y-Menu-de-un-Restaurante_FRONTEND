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
import { Restaurant, MenuBook, TableChart, ShoppingCart, Logout } from '@mui/icons-material';
import { useAuth } from '../AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
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
                  Crea y administra el menú de tu restaurante.
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Ver Menús
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
                <Button variant="contained" sx={{ mt: 2 }}>
                  Ver Pedidos
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
                <Button variant="contained" sx={{ mt: 2 }}>
                  Ver Mesas
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

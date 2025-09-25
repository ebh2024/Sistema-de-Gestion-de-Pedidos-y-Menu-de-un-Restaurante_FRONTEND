import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Card,
  CardContent,
  Link
} from '@mui/material';
import { Restaurant, MenuBook, TableChart, ShoppingCart, Login, PersonAdd } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Home = () => {
  const { user } = useAuth();

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
          {user ? (
            <Button color="inherit" component={RouterLink} to="/dashboard">
              Ir al Panel
            </Button>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login" startIcon={<Login />}>
                Iniciar Sesión
              </Button>
              <Button color="inherit" component={RouterLink} to="/register" startIcon={<PersonAdd />}>
                Registrarse
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 8, mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Bienvenido al Sistema de Gestión
          </Typography>
          <Typography variant="h5" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
            Gestiona pedidos, menús y mesas de manera eficiente.
          </Typography>
          {!user && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                sx={{ mr: 2, px: 4, py: 1.5 }}
                component={RouterLink}
                to="/register"
              >
                Comenzar Ahora
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5 }}
                component={RouterLink}
                to="/login"
              >
                Iniciar Sesión
              </Button>
            </Box>
          )}
        </Box>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <MenuBook sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom>
                  Gestión de Menús
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crea y administra el menú de tu restaurante fácilmente.
                </Typography>
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;

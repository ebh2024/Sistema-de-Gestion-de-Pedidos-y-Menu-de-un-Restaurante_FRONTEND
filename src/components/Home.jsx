import React from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDishes } from './DishContext';

function Home() {
  const navigate = useNavigate();
  const { dishes } = useDishes();
  const availableDishes = dishes.filter(dish => dish.available).slice(0, 6); // Show first 6 dishes

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Sistema de Gestión de Pedidos y Menú
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Gestiona tus pedidos de manera eficiente y moderna
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Una solución completa para restaurantes que incluye gestión de mesas,
            pedidos, menú y personal administrativo.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{
              backgroundColor: 'white',
              color: '#667eea',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              },
              px: 4,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Iniciar Sesión
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom textAlign="center" color="primary">
          Características Principales
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Gestión de Pedidos
              </Typography>
              <Typography variant="body1">
                Crea y administra pedidos de manera intuitiva con seguimiento en tiempo real.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Control de Mesas
              </Typography>
              <Typography variant="body1">
                Administra la disponibilidad y estado de todas las mesas del restaurante.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Menú Dinámico
              </Typography>
              <Typography variant="body1">
                Actualiza tu menú fácilmente y controla la disponibilidad de platos.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Menu Preview Section */}
      <Box sx={{ backgroundColor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom textAlign="center" color="primary">
            Nuestro Menú
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            Descubre algunos de nuestros deliciosos platos
          </Typography>
          {availableDishes.length === 0 ? (
            <Typography variant="h6" textAlign="center" color="text.secondary">
              El menú se está cargando...
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {availableDishes.map((dish) => (
                <Grid key={dish.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {dish.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {dish.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary">
                          ${dish.price?.toFixed(2)}
                        </Typography>
                        <Chip label="Disponible" color="success" size="small" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ backgroundColor: '#333', color: 'white', py: 6, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            ¿Listo para comenzar?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Únete a nuestro sistema y mejora la eficiencia de tu restaurante.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{
              backgroundColor: '#667eea',
              '&:hover': {
                backgroundColor: '#5a6fd8'
              },
              px: 4,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Acceder al Sistema
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;

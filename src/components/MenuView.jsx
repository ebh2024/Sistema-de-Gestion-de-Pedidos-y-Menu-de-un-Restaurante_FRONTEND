import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { Restaurant } from '@mui/icons-material';
import axios from 'axios';

const MenuView = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/dishes');
      // Filter only available dishes
      const availableDishes = response.data.filter(dish => dish.disponibilidad === 1);
      setDishes(availableDishes);
    } catch {
      showSnackbar('Error al cargar el menú', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>Cargando menú...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Menú del Restaurante
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Platos disponibles para ordenar
        </Typography>
      </Box>

      {dishes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Restaurant sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay platos disponibles en este momento
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {dishes.map((dish) => (
            <Grid item xs={12} sm={6} md={4} key={dish.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    backgroundColor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Restaurant sx={{ fontSize: 48, color: 'grey.500' }} />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {dish.nombre}
                    </Typography>
                    <Chip
                      label={`$${dish.precio}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  {dish.descripcion && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {dish.descripcion}
                    </Typography>
                  )}
                  <Chip
                    label="Disponible"
                    color="success"
                    size="small"
                    variant="filled"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MenuView;

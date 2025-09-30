import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip
} from '@mui/material';
import { useDishes } from './DishContext';

function MenuView() {
  const { dishes } = useDishes();
  const availableDishes = dishes.filter(dish => dish.available);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Menú Disponible
      </Typography>
      {availableDishes.length === 0 ? (
        <Typography>No hay platos disponibles en el menú.</Typography>
      ) : (
        <Grid container spacing={2}>
          {availableDishes.map((dish) => (
            <Grid item xs={12} sm={6} md={4} key={dish.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {dish.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {dish.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${dish.price?.toFixed(2)}
                  </Typography>
                  <Chip label="Disponible" color="success" size="small" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default MenuView;

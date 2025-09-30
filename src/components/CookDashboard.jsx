import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import MenuView from './MenuView';

function CookDashboard({ user, onLogout }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Cocinero
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bienvenido, {user.email} (Rol: {user.role})
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Funciones de Cocinero:</Typography>
        <ul>
          <li>Ver pedidos pendientes</li>
          <li>Actualizar estado de preparación</li>
          <li>Ver inventario</li>
          <li>Recibir notificaciones de nuevos pedidos</li>
        </ul>
      </Paper>
      <Box sx={{ mt: 4 }}>
        <MenuView />
      </Box>
      <Button variant="outlined" onClick={onLogout} sx={{ mt: 2 }}>
        Cerrar Sesión
      </Button>
    </Box>
  );
}

export default CookDashboard;

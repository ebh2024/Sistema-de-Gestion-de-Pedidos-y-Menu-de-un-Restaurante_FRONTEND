import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import MenuView from './MenuView';
import TableGrid from './TableGrid';

function WaiterDashboard({ user, onLogout }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Mesero
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bienvenido, {user.email} (Rol: {user.role})
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Funciones de Mesero:</Typography>
        <ul>
          <li>Tomar pedidos</li>
          <li>Ver mesas asignadas</li>
          <li>Actualizar estado de pedidos</li>
          <li>Ver menú</li>
        </ul>
      </Paper>
      <Box sx={{ mt: 4 }}>
        <TableGrid />
        <Box sx={{ mt: 4 }}>
          <MenuView />
        </Box>
      </Box>
      <Button variant="outlined" onClick={onLogout} sx={{ mt: 2 }}>
        Cerrar Sesión
      </Button>
    </Box>
  );
}

export default WaiterDashboard;

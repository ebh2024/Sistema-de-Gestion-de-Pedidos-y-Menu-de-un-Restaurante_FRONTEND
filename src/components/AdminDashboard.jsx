import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import DishList from './DishList';

function AdminDashboard({ user, onLogout }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bienvenido, {user.email} (Rol: {user.role})
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Funciones de Admin:</Typography>
        <ul>
          <li>Gestionar menú</li>
          <li>Gestionar usuarios</li>
          <li>Ver reportes</li>
          <li>Configurar sistema</li>
        </ul>
      </Paper>
      <Box sx={{ mt: 4 }}>
        <DishList />
      </Box>
      <Button variant="outlined" onClick={onLogout} sx={{ mt: 2 }}>
        Cerrar Sesión
      </Button>
    </Box>
  );
}

export default AdminDashboard;

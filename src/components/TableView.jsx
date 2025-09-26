import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { TableChart } from '@mui/icons-material';
import axios from 'axios';

const TableView = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'available': return 'success';
      case 'occupied': return 'error';
      case 'cleaning': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Ocupada';
      case 'cleaning': return 'Limpiando';
      default: return estado;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>Cargando mesas...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Estado de las Mesas
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Visualiza el estado actual de todas las mesas
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <TableChart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom>
                  Mesa {table.numero}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Capacidad: {table.capacidad} personas
                </Typography>
                <Chip
                  label={getStatusText(table.estado)}
                  color={getStatusColor(table.estado)}
                  variant="filled"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TableView;

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { useTables } from './TableContext';

function TableGrid() {
  const { tables, loading, toggleAvailability } = useTables();

  if (loading) {
    return <Typography>Cargando mesas...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Estado de Mesas</Typography>
      {tables.length === 0 ? (
        <Typography>No hay mesas definidas.</Typography>
      ) : (
        <Grid container spacing={2}>
          {tables.map((table) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
              <Card
                sx={{
                  backgroundColor: table.available ? '#e8f5e8' : '#ffebee',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 3 }
                }}
                onClick={() => toggleAvailability(table.id)}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    Mesa {table.number}
                  </Typography>
                  <Typography color="text.secondary">
                    Capacidad: {table.capacity}
                  </Typography>
                  <Chip
                    label={table.available ? 'Disponible' : 'Ocupada'}
                    color={table.available ? 'success' : 'error'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default TableGrid;

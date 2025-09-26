import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Snackbar,
  Fab
} from '@mui/material';
import { Add, Edit, Delete, TableChart } from '@mui/icons-material';
import axios from 'axios';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    capacidad: '',
    estado: 'available'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tables');
      setTables(response.data);
    } catch {
      showSnackbar('Error al cargar las mesas', 'error');
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

  const handleOpenDialog = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        numero: table.numero,
        capacidad: table.capacidad,
        estado: table.estado
      });
    } else {
      setEditingTable(null);
      setFormData({
        numero: '',
        capacidad: '',
        estado: 'available'
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingTable(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.numero || !formData.capacidad) {
      showSnackbar('Número y capacidad son requeridos', 'error');
      return;
    }

    try {
      const tableData = {
        ...formData,
        numero: parseInt(formData.numero),
        capacidad: parseInt(formData.capacidad)
      };

      if (editingTable) {
        await axios.put(`http://localhost:3000/api/tables/${editingTable.id}`, tableData);
        showSnackbar('Mesa actualizada exitosamente');
      } else {
        await axios.post('http://localhost:3000/api/tables', tableData);
        showSnackbar('Mesa creada exitosamente');
      }

      handleCloseDialog();
      fetchTables();
    } catch {
      showSnackbar('Error al guardar la mesa', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
      try {
        await axios.delete(`http://localhost:3000/api/tables/${id}`);
        showSnackbar('Mesa eliminada exitosamente');
        fetchTables();
      } catch {
        showSnackbar('Error al eliminar la mesa', 'error');
      }
    }
  };

  const updateTableStatus = async (table, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/tables/${table.id}`, {
        ...table,
        estado: newStatus
      });
      showSnackbar('Estado de la mesa actualizado');
      fetchTables();
    } catch {
      showSnackbar('Error al actualizar el estado', 'error');
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'available': return 'green';
      case 'occupied': return 'red';
      case 'cleaning': return 'orange';
      default: return 'gray';
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
          Gestión de Mesas
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Administra las mesas de tu restaurante
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell>{table.numero}</TableCell>
                <TableCell>{table.capacidad}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(table.estado),
                        mr: 1
                      }}
                    />
                    {getStatusText(table.estado)}
                  </Box>
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ mr: 1, minWidth: 100 }}>
                    <Select
                      value={table.estado}
                      onChange={(e) => updateTableStatus(table, e.target.value)}
                    >
                      <MenuItem value="available">Disponible</MenuItem>
                      <MenuItem value="occupied">Ocupada</MenuItem>
                      <MenuItem value="cleaning">Limpiando</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => handleOpenDialog(table)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(table.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <Add />
      </Fab>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTable ? 'Editar Mesa' : 'Nueva Mesa'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="numero"
              label="Número de mesa"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.numero}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="capacidad"
              label="Capacidad"
              type="number"
              fullWidth
              variant="outlined"
              inputProps={{ min: 1 }}
              value={formData.capacidad}
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                label="Estado"
              >
                <MenuItem value="available">Disponible</MenuItem>
                <MenuItem value="occupied">Ocupada</MenuItem>
                <MenuItem value="cleaning">Limpiando</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingTable ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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

export default TableManagement;

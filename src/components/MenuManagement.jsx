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
  Switch,
  FormControlLabel,
  IconButton,
  Alert,
  Snackbar,
  Fab
} from '@mui/material';
import { Add, Edit, Delete, Restaurant } from '@mui/icons-material';
import axios from 'axios';

const MenuManagement = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    disponibilidad: true
  });
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
      setDishes(response.data);
    } catch {
      showSnackbar('Error al cargar los platos', 'error');
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

  const handleOpenDialog = (dish = null) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({
        nombre: dish.nombre,
        descripcion: dish.descripcion || '',
        precio: dish.precio,
        disponibilidad: dish.disponibilidad === 1
      });
    } else {
      setEditingDish(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        disponibilidad: true
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingDish(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'disponibilidad' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio) {
      showSnackbar('Nombre y precio son requeridos', 'error');
      return;
    }

    try {
      const dishData = {
        ...formData,
        precio: parseFloat(formData.precio),
        disponibilidad: formData.disponibilidad ? 1 : 0
      };

      if (editingDish) {
        await axios.put(`http://localhost:3000/api/dishes/${editingDish.id}`, dishData);
        showSnackbar('Plato actualizado exitosamente');
      } else {
        await axios.post('http://localhost:3000/api/dishes', dishData);
        showSnackbar('Plato creado exitosamente');
      }

      handleCloseDialog();
      fetchDishes();
    } catch {
      showSnackbar('Error al guardar el plato', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plato?')) {
      try {
        await axios.delete(`http://localhost:3000/api/dishes/${id}`);
        showSnackbar('Plato eliminado exitosamente');
        fetchDishes();
      } catch {
        showSnackbar('Error al eliminar el plato', 'error');
      }
    }
  };

  const toggleAvailability = async (dish) => {
    try {
      const updatedDish = {
        ...dish,
        disponibilidad: dish.disponibilidad === 1 ? 0 : 1
      };
      await axios.put(`http://localhost:3000/api/dishes/${dish.id}`, updatedDish);
      showSnackbar('Disponibilidad actualizada');
      fetchDishes();
    } catch {
      showSnackbar('Error al actualizar disponibilidad', 'error');
    }
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
          Gestión de Menú
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Administra los platos de tu restaurante
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dishes.map((dish) => (
              <TableRow key={dish.id}>
                <TableCell>{dish.nombre}</TableCell>
                <TableCell>{dish.descripcion}</TableCell>
                <TableCell>${dish.precio}</TableCell>
                <TableCell>
                  <Switch
                    checked={dish.disponibilidad === 1}
                    onChange={() => toggleAvailability(dish)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(dish)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(dish.id)} color="error">
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
          {editingDish ? 'Editar Plato' : 'Nuevo Plato'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre del plato"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="descripcion"
              label="Descripción"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={formData.descripcion}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="precio"
              label="Precio"
              type="number"
              fullWidth
              variant="outlined"
              inputProps={{ min: 0, step: 0.01 }}
              value={formData.precio}
              onChange={handleInputChange}
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.disponibilidad}
                  onChange={handleInputChange}
                  name="disponibilidad"
                  color="primary"
                />
              }
              label="Disponible"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingDish ? 'Actualizar' : 'Crear'}
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

export default MenuManagement;

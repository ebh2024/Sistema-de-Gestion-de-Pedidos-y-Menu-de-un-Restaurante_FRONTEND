import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useDishes } from './DishContext';
import DishForm from './DishForm';

function DishList() {
  const { dishes, deleteDish, toggleAvailability } = useDishes();
  const [editingDish, setEditingDish] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const handleEdit = (dish) => {
    setEditingDish(dish);
  };

  const handleDelete = (dish) => {
    setDeleteDialog(dish);
  };

  const confirmDelete = () => {
    if (deleteDialog) {
      deleteDish(deleteDialog.id);
      setDeleteDialog(null);
    }
  };

  const handleToggle = (dish) => {
    toggleAvailability(dish.id);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Gestión de Platos
      </Typography>
      <Button
        variant="contained"
        onClick={() => setEditingDish({})}
        sx={{ mb: 2 }}
      >
        Agregar Plato
      </Button>
      {dishes.length === 0 ? (
        <Typography>No hay platos registrados.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Disponible</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dishes.map((dish) => (
                <TableRow key={dish.id}>
                  <TableCell>{dish.name}</TableCell>
                  <TableCell>${dish.price?.toFixed(2)}</TableCell>
                  <TableCell>{dish.description}</TableCell>
                  <TableCell>
                    <Switch
                      checked={dish.available ?? true}
                      onChange={() => handleToggle(dish)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(dish)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(dish)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <DishForm
        open={!!editingDish}
        onClose={() => setEditingDish(null)}
        dish={editingDish}
      />
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que quieres eliminar el plato "{deleteDialog?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DishList;

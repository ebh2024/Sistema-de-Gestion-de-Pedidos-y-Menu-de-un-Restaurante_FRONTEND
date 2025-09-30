import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useTables } from './TableContext';
import TableForm from './TableForm';

function TableList() {
  const { tables, deleteTable, toggleAvailability, loading } = useTables();
  const [openForm, setOpenForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleAdd = () => {
    setEditingTable(null);
    setOpenForm(true);
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteAction = () => {
    deleteTable(confirmDelete);
    setConfirmDelete(null);
  };

  const handleToggle = (id) => {
    toggleAvailability(id);
  };

  if (loading) {
    return <Typography>Cargando mesas...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Gestión de Mesas</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Agregar Mesa
        </Button>
      </Box>
      {tables.length === 0 ? (
        <Typography>No hay mesas definidas.</Typography>
      ) : (
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
                  <TableCell>{table.number}</TableCell>
                  <TableCell>{table.capacity}</TableCell>
                  <TableCell>
                    <Chip
                      label={table.available ? 'Disponible' : 'Ocupada'}
                      color={table.available ? 'success' : 'error'}
                      onClick={() => handleToggle(table.id)}
                      clickable
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(table)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(table.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TableForm open={openForm} onClose={() => setOpenForm(false)} table={editingTable} />
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar esta mesa?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          <Button onClick={confirmDeleteAction} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TableList;

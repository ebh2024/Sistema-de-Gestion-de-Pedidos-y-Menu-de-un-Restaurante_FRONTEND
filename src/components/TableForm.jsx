import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTables } from './TableContext';

function TableForm({ open, onClose, table }) {
  const { addTable, updateTable } = useTables();
  const [formData, setFormData] = useState({
    number: table ? table.number : '',
    capacity: table ? table.capacity : 2,
    available: table ? table.available : true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'capacity' ? parseInt(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (table) {
      updateTable(table.id, formData);
    } else {
      addTable(formData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{table ? 'Editar Mesa' : 'Agregar Mesa'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="number"
          label="Número de Mesa"
          type="text"
          fullWidth
          variant="standard"
          value={formData.number}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="capacity"
          label="Capacidad"
          type="number"
          fullWidth
          variant="standard"
          value={formData.capacity}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Disponibilidad</InputLabel>
          <Select
            name="available"
            value={formData.available}
            onChange={handleChange}
          >
            <MenuItem value={true}>Disponible</MenuItem>
            <MenuItem value={false}>Ocupada</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TableForm;

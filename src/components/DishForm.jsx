import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Alert
} from '@mui/material';
import { useDishes } from './DishContext';

function DishForm({ open, onClose, dish }) {
  const { addDish, updateDish, loading, setLoading } = useDishes();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    available: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name || '',
        price: dish.price || '',
        description: dish.description || '',
        available: dish.available ?? true
      });
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        available: true
      });
    }
    setErrors({});
  }, [dish, open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Precio debe ser un número mayor a 0';
    }
    if (!formData.description.trim()) newErrors.description = 'Descripción es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dishData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    if (dish) {
      updateDish(dish.id, dishData);
    } else {
      addDish(dishData);
    }
    onClose();
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dish ? 'Editar Plato' : 'Agregar Plato'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Nombre"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Precio"
            type="number"
            value={formData.price}
            onChange={handleChange('price')}
            error={!!errors.price}
            helperText={errors.price}
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              />
            }
            label="Disponible"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Guardando...' : (dish ? 'Actualizar' : 'Agregar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DishForm;

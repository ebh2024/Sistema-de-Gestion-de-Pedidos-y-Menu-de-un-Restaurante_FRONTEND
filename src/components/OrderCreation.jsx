import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderCreation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  useEffect(() => {
    if (user?.rol !== 'mesero') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [tablesRes, dishesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/tables'),
        axios.get('http://localhost:3000/api/dishes')
      ]);

      const availableTables = tablesRes.data.filter(table => table.estado === 'available');
      setTables(availableTables);

      const availableDishes = dishesRes.data.filter(dish => dish.disponibilidad);
      setDishes(availableDishes);
    } catch {
      showSnackbar('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addDishToOrder = (dish) => {
    const existingItem = orderItems.find(item => item.id_plato === dish.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.id_plato === dish.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        id_plato: dish.id,
        cantidad: 1,
        precio_unitario: dish.precio,
        nombre: dish.nombre
      }]);
    }
  };

  const updateQuantity = (id_plato, change) => {
    setOrderItems(orderItems.map(item => {
      if (item.id_plato === id_plato) {
        const newQuantity = item.cantidad + change;
        return newQuantity > 0 ? { ...item, cantidad: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.cantidad * item.precio_unitario), 0);
  };

  const handleSaveDraft = () => {
    if (!selectedTable || orderItems.length === 0) {
      showSnackbar('Selecciona una mesa y al menos un plato', 'warning');
      return;
    }
    setSaveAsDraft(true);
    handleSubmit(true);
  };

  const handleSendOrder = () => {
    if (!selectedTable || orderItems.length === 0) {
      showSnackbar('Selecciona una mesa y al menos un plato', 'warning');
      return;
    }
    setSaveAsDraft(false);
    setConfirmDialog(true);
  };

  const handleSubmit = async (isDraft = false) => {
    setSubmitting(true);

    try {
      const orderData = {
        id_mesa: selectedTable,
        detalles: orderItems.map(item => ({
          id_plato: item.id_plato,
          cantidad: item.cantidad
        })),
        estado: isDraft ? 'borrador' : 'pendiente'
      };

      await axios.post('http://localhost:3000/api/orders', orderData);
      showSnackbar(isDraft ? 'Borrador guardado exitosamente' : 'Pedido enviado exitosamente', 'success');
      // Reset form
      setSelectedTable('');
      setOrderItems([]);
      // Navigate to order management
      setTimeout(() => navigate('/order-management'), 2000);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear pedido';
      showSnackbar(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSubmit = () => {
    setConfirmDialog(false);
    handleSubmit(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>Cargando...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crear Nuevo Pedido
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Selecciona una mesa y los platos para el pedido
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seleccionar Mesa
              </Typography>
              <TextField
                select
                fullWidth
                label="Mesa Disponible"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                sx={{ mb: 2 }}
              >
                {tables.map((table) => (
                  <MenuItem key={table.id} value={table.id}>
                    Mesa {table.numero} - Capacidad: {table.capacidad}
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Platos Disponibles
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Grid container spacing={2}>
                  {dishes.map((dish) => (
                    <Grid item xs={12} key={dish.id}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1">{dish.nombre}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${dish.precio}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => addDishToOrder(dish)}
                            startIcon={<Add />}
                          >
                            Agregar
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen del Pedido
              </Typography>

              {orderItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ShoppingCart sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    No hay platos seleccionados
                  </Typography>
                </Box>
              ) : (
                <>
                  <List>
                    {orderItems.map((item) => (
                      <ListItem key={item.id_plato}>
                        <ListItemText
                          primary={item.nombre}
                          secondary={`$${item.precio_unitario} x ${item.cantidad} = $${(item.precio_unitario * item.cantidad).toFixed(2)}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => updateQuantity(item.id_plato, -1)}>
                            <Remove />
                          </IconButton>
                          <Chip label={item.cantidad} size="small" sx={{ mx: 1 }} />
                          <IconButton onClick={() => updateQuantity(item.id_plato, 1)}>
                            <Add />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" align="right">
                    Total: ${calculateTotal().toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleSaveDraft}
                      disabled={submitting}
                    >
                      Guardar como Borrador
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSendOrder}
                      disabled={submitting}
                    >
                      {submitting ? 'Enviando...' : 'Enviar Pedido'}
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirmar Pedido</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de crear este pedido para la Mesa {tables.find(t => t.id === selectedTable)?.numero}?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Total: ${calculateTotal().toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancelar</Button>
          <Button onClick={confirmSubmit} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
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

export default OrderCreation;

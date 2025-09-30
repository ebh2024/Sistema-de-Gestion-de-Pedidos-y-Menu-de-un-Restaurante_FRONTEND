import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, Grid, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel, TextField,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, List, ListItem, ListItemText, Divider, CircularProgress
} from '@mui/material';
import { Add, Remove, Delete, Download, Send } from '@mui/icons-material';
import { useDishes } from './DishContext';
import { useTables } from './TableContext';
import { useOrders } from './OrderContext';
import jsPDF from 'jspdf';

function WaiterDashboard({ user, onLogout }) {
  const { dishes } = useDishes();
  const { tables } = useTables();
  const { addOrder, orders, loading, setLoading } = useOrders();

  const [selectedTable, setSelectedTable] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);

  const availableTables = tables.filter(table => table.available);
  const availableDishes = dishes.filter(dish => dish.available);

  const handleAddDish = (dish) => {
    const existingItem = orderItems.find(item => item.dishId === dish.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.dishId === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1
      }]);
    }
  };

  const handleUpdateQuantity = (dishId, quantity) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter(item => item.dishId !== dishId));
    } else {
      setOrderItems(orderItems.map(item =>
        item.dishId === dishId ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveDish = (dishId) => {
    setOrderItems(orderItems.filter(item => item.dishId !== dishId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSendOrder = async () => {
    if (!selectedTable || orderItems.length === 0) {
      alert('Seleccione una mesa y agregue al menos un plato');
      return;
    }

    setLoading(true);
    try {
      const orderId = addOrder({
        tableId: selectedTable,
        waiterId: user.id,
        items: orderItems
      });

      // Reset form
      setSelectedTable('');
      setOrderItems([]);
      setConfirmSendOpen(false);

      // Generate PDF ticket
      generateTicketPDF(orderId);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTicketPDF = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Ticket de Pedido', 20, 30);

    doc.setFontSize(12);
    doc.text(`Pedido #${order.id}`, 20, 50);
    doc.text(`Mesa: ${tables.find(t => t.id === order.tableId)?.number || 'N/A'}`, 20, 60);
    doc.text(`Fecha: ${new Date(order.createdAt).toLocaleString()}`, 20, 70);
    doc.text(`Mesero: ${user.email}`, 20, 80);

    doc.text('Platos:', 20, 100);
    let y = 110;
    order.items.forEach(item => {
      doc.text(`${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`, 20, y);
      y += 10;
    });

    doc.text(`Total: $${order.total.toFixed(2)}`, 20, y + 10);

    doc.save(`ticket_pedido_${order.id}.pdf`);
  };

  const handleDownloadTicket = (orderId) => {
    generateTicketPDF(orderId);
  };

  const pendingOrders = orders.filter(order => order.waiterId === user.id && order.status !== 'Cancelado');

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Mesero
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bienvenido, {user.email} (Rol: {user.role})
      </Typography>

      {/* Create Order Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Crear Nuevo Pedido</Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Seleccionar Mesa</InputLabel>
          <Select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            label="Seleccionar Mesa"
          >
            {availableTables.map(table => (
              <MenuItem key={table.id} value={table.id}>
                Mesa {table.number} - {table.seats} personas
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Agregar Platos</Typography>
        <Grid container spacing={2}>
          {availableDishes.map(dish => (
            <Grid item xs={12} sm={6} md={4} key={dish.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{dish.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dish.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${dish.price?.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAddDish(dish)}
                    sx={{ mt: 1 }}
                  >
                    Agregar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {orderItems.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Pedido Actual</Typography>
            <List>
              {orderItems.map(item => (
                <ListItem key={item.dishId}>
                  <ListItemText
                    primary={`${item.name} - $${item.price.toFixed(2)}`}
                    secondary={`Cantidad: ${item.quantity} - Subtotal: $${(item.price * item.quantity).toFixed(2)}`}
                  />
                  <IconButton onClick={() => handleUpdateQuantity(item.dishId, item.quantity - 1)}>
                    <Remove />
                  </IconButton>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item.dishId, parseInt(e.target.value) || 0)}
                    inputProps={{ min: 1 }}
                    sx={{ width: 80, mx: 1 }}
                  />
                  <IconButton onClick={() => handleUpdateQuantity(item.dishId, item.quantity + 1)}>
                    <Add />
                  </IconButton>
                  <IconButton onClick={() => handleRemoveDish(item.dishId)} color="error">
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${calculateTotal().toFixed(2)}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => setPreviewOpen(true)} sx={{ mr: 2 }}>
                Vista Previa
              </Button>
              <Button
                variant="contained"
                onClick={() => setConfirmSendOpen(true)}
                disabled={!selectedTable || orderItems.length === 0}
              >
                {loading ? <CircularProgress size={24} /> : 'Enviar Pedido'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Orders Status Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Estado de Pedidos</Typography>
        {pendingOrders.length === 0 ? (
          <Typography>No hay pedidos pendientes.</Typography>
        ) : (
          <List>
            {pendingOrders.map(order => (
              <ListItem key={order.id}>
                <ListItemText
                  primary={`Pedido #${order.id} - Mesa ${tables.find(t => t.id === order.tableId)?.number || 'N/A'}`}
                  secondary={`Estado: ${order.status} - Total: $${order.total.toFixed(2)} - ${new Date(order.createdAt).toLocaleString()}`}
                />
                <Chip label={order.status} color={
                  order.status === 'Pendiente' ? 'warning' :
                  order.status === 'En preparación' ? 'info' :
                  order.status === 'Servido' ? 'success' : 'default'
                } />
                <IconButton onClick={() => handleDownloadTicket(order.id)} sx={{ ml: 1 }}>
                  <Download />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Button variant="outlined" onClick={onLogout} sx={{ mt: 2 }}>
        Cerrar Sesión
      </Button>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Vista Previa del Pedido</DialogTitle>
        <DialogContent>
          <Typography>Mesa: {tables.find(t => t.id === selectedTable)?.number || 'No seleccionada'}</Typography>
          <Divider sx={{ my: 2 }} />
          <List>
            {orderItems.map(item => (
              <ListItem key={item.dishId}>
                <ListItemText
                  primary={item.name}
                  secondary={`Cantidad: ${item.quantity} - Precio: $${item.price.toFixed(2)} - Subtotal: $${(item.price * item.quantity).toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ${calculateTotal().toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Send Dialog */}
      <Dialog open={confirmSendOpen} onClose={() => setConfirmSendOpen(false)}>
        <DialogTitle>Confirmar Envío</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de enviar este pedido?</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Mesa: {tables.find(t => t.id === selectedTable)?.number || 'No seleccionada'}
          </Typography>
          <Typography variant="body2">
            Total: ${calculateTotal().toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSendOpen(false)}>Cancelar</Button>
          <Button onClick={handleSendOrder} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WaiterDashboard;

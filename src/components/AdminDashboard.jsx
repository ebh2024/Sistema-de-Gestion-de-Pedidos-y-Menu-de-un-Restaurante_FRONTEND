import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, List, ListItem, ListItemText,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Tabs, Tab
} from '@mui/material';
import { Cancel, Visibility } from '@mui/icons-material';
import DishList from './DishList';
import TableList from './TableList';
import { useOrders } from './OrderContext';
import { useTables } from './TableContext';

function AdminDashboard({ user, onLogout }) {
  const { orders, cancelOrder, loading, setLoading } = useOrders();
  const { tables } = useTables();

  const [tabValue, setTabValue] = useState(0);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setConfirmCancelOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    try {
      cancelOrder(selectedOrder.id);
      setConfirmCancelOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'warning';
      case 'En preparación': return 'info';
      case 'Servido': return 'success';
      case 'Cancelado': return 'error';
      default: return 'default';
    }
  };

  const allOrders = orders;
  const activeOrders = orders.filter(order => order.status !== 'Cancelado');
  const cancelledOrders = orders.filter(order => order.status === 'Cancelado');

  const currentOrders = tabValue === 0 ? allOrders : tabValue === 1 ? activeOrders : cancelledOrders;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bienvenido, {user.email} (Rol: {user.role})
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="order tabs">
          <Tab label="Todos los Pedidos" />
          <Tab label="Pedidos Activos" />
          <Tab label="Pedidos Cancelados" />
        </Tabs>
      </Box>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {tabValue === 0 ? 'Lista de Todos los Pedidos' :
           tabValue === 1 ? 'Lista de Pedidos Activos' :
           'Lista de Pedidos Cancelados'}
        </Typography>

        {currentOrders.length === 0 ? (
          <Typography>No hay pedidos en esta categoría.</Typography>
        ) : (
          <List>
            {currentOrders.map(order => (
              <ListItem key={order.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">
                        Pedido #{order.id}
                      </Typography>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography>
                        Mesa: {tables.find(t => t.id === order.tableId)?.number || 'N/A'}
                      </Typography>
                      <Typography>
                        Fecha: {new Date(order.createdAt).toLocaleString()}
                      </Typography>
                      <Typography>
                        Total: ${order.total.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {order.items.length} plato(s)
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => handleViewOrder(order)}
                    color="primary"
                    title="Ver Detalles"
                  >
                    <Visibility />
                  </IconButton>
                  {order.status !== 'Cancelado' && order.status !== 'Servido' && (
                    <IconButton
                      onClick={() => handleCancelOrder(order)}
                      color="error"
                      title="Cancelar Pedido"
                      disabled={loading}
                    >
                      <Cancel />
                    </IconButton>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Management Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={0} aria-label="management tabs">
          <Tab label="Gestión de Platos" />
          <Tab label="Gestión de Mesas" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          <DishList />
          <Box sx={{ mt: 4 }}>
            <TableList />
          </Box>
        </Box>
      </Box>

      <Button variant="outlined" onClick={onLogout} sx={{ mt: 2 }}>
        Cerrar Sesión
      </Button>

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onClose={() => setOrderDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Pedido #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography><strong>Mesa:</strong> {tables.find(t => t.id === selectedOrder.tableId)?.number || 'N/A'}</Typography>
              <Typography><strong>Estado:</strong> {selectedOrder.status}</Typography>
              <Typography><strong>Fecha:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</Typography>
              <Typography><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>Platos:</Typography>
              <List>
                {selectedOrder.items.map(item => (
                  <ListItem key={item.dishId}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Cantidad: ${item.quantity} - Precio: $${item.price.toFixed(2)} - Subtotal: $${(item.price * item.quantity).toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailsOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Cancel Dialog */}
      <Dialog open={confirmCancelOpen} onClose={() => setConfirmCancelOpen(false)}>
        <DialogTitle>Confirmar Cancelación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de cancelar el pedido #{selectedOrder?.id}?
          </Typography>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Mesa: {tables.find(t => t.id === selectedOrder.tableId)?.number || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Total: ${selectedOrder.total.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="error">
                Esta acción no se puede deshacer.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancelOpen(false)}>No Cancelar</Button>
          <Button
            onClick={confirmCancel}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sí, Cancelar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard;

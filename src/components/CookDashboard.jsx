import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, List, ListItem, ListItemText,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress
} from '@mui/material';
import { Print, CheckCircle, Restaurant } from '@mui/icons-material';
import { useOrders } from './OrderContext';
import { useTables } from './TableContext';
import jsPDF from 'jspdf';

function CookDashboard({ user, onLogout }) {
  const { orders, updateOrderStatus, loading, setLoading } = useOrders();
  const { tables } = useTables();

  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Get orders that are not cancelled and not served
  const activeOrders = orders.filter(order =>
    order.status !== 'Cancelado' && order.status !== 'Servido'
  );

  const handleStatusChange = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setConfirmStatusOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    try {
      updateOrderStatus(selectedOrder.id, newStatus);

      if (newStatus === 'En preparación') {
        // Generate comanda PDF
        generateComandaPDF(selectedOrder.id);
      }

      setConfirmStatusOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateComandaPDF = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Comanda de Cocina', 20, 30);

    doc.setFontSize(14);
    doc.text(`Pedido #${order.id}`, 20, 50);
    doc.text(`Mesa: ${tables.find(t => t.id === order.tableId)?.number || 'N/A'}`, 20, 60);
    doc.text(`Fecha: ${new Date(order.createdAt).toLocaleString()}`, 20, 70);

    doc.setFontSize(12);
    doc.text('Platos a preparar:', 20, 90);
    let y = 100;
    order.items.forEach(item => {
      doc.text(`• ${item.name} - Cantidad: ${item.quantity}`, 20, y);
      y += 10;
    });

    doc.text(`Total: $${order.total.toFixed(2)}`, 20, y + 10);

    doc.save(`comanda_pedido_${order.id}.pdf`);
  };

  const handlePrintComanda = (orderId) => {
    generateComandaPDF(orderId);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Cocinero
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bienvenido, {user.email} (Rol: {user.role})
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Cola de Pedidos</Typography>

        {activeOrders.length === 0 ? (
          <Typography>No hay pedidos pendientes.</Typography>
        ) : (
          <List>
            {activeOrders.map(order => (
              <ListItem key={order.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">
                        Pedido #{order.id}
                      </Typography>
                      <Chip
                        label={order.status}
                        color={
                          order.status === 'Pendiente' ? 'warning' :
                          order.status === 'En preparación' ? 'info' : 'default'
                        }
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
                        Platos:
                        {order.items.map(item => (
                          <div key={item.dishId}>
                            • {item.name} x{item.quantity}
                          </div>
                        ))}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {order.status === 'Pendiente' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Restaurant />}
                      onClick={() => handleStatusChange(order, 'En preparación')}
                      disabled={loading}
                    >
                      En Preparación
                    </Button>
                  )}
                  {order.status === 'En preparación' && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleStatusChange(order, 'Servido')}
                      disabled={loading}
                    >
                      Servido
                    </Button>
                  )}
                  <IconButton
                    onClick={() => handlePrintComanda(order.id)}
                    color="primary"
                    title="Imprimir Comanda"
                  >
                    <Print />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Button variant="outlined" onClick={onLogout} sx={{ mt: 2 }}>
        Cerrar Sesión
      </Button>

      {/* Confirm Status Change Dialog */}
      <Dialog open={confirmStatusOpen} onClose={() => setConfirmStatusOpen(false)}>
        <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Cambiar el estado del pedido #{selectedOrder?.id} a "{newStatus}"?
          </Typography>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Mesa: {tables.find(t => t.id === selectedOrder.tableId)?.number || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Total: ${selectedOrder.total.toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmStatusOpen(false)}>Cancelar</Button>
          <Button
            onClick={confirmStatusChange}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CookDashboard;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material';
import { Edit, Delete, PlayArrow, Print } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderManagementWaiter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    orderId: null,
    newStatus: ''
  });
  const [ticketDialog, setTicketDialog] = useState({
    open: false,
    order: null
  });

  useEffect(() => {
    if (user?.rol !== 'mesero') {
      navigate('/dashboard');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      setOrders(response.data);
    } catch {
      showSnackbar('Error al cargar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/orders/${statusDialog.orderId}/status`, {
        estado: statusDialog.newStatus
      });
      showSnackbar('Estado del pedido actualizado', 'success');
      setStatusDialog({ open: false, orderId: null, newStatus: '' });
      fetchOrders(); // Refresh orders
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar estado';
      showSnackbar(message, 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/orders/${orderId}`);
      showSnackbar('Pedido eliminado', 'success');
      fetchOrders();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al eliminar pedido';
      showSnackbar(message, 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrador': return 'default';
      case 'pendiente': return 'warning';
      case 'en preparación': return 'info';
      case 'servido': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'borrador': return 'Borrador';
      case 'pendiente': return 'Pendiente';
      case 'en preparación': return 'En Preparación';
      case 'servido': return 'Servido';
      default: return status;
    }
  };

  const canChangeStatus = (currentStatus) => {
    // Waiters can change from borrador to pendiente, pendiente to en preparación, en preparación to servido
    return ['borrador', 'pendiente', 'en preparación'].includes(currentStatus);
  };

  const getNextStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'borrador': return [{ value: 'pendiente', label: 'Enviar a Cocina' }];
      case 'pendiente': return [{ value: 'en preparación', label: 'Marcar en Preparación' }];
      case 'en preparación': return [{ value: 'servido', label: 'Marcar como Servido' }];
      default: return [];
    }
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
          <Typography>Cargando pedidos...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Pedidos
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Administra tus pedidos activos
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/order-creation')}
        >
          Crear Nuevo Pedido
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No tienes pedidos activos
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Mesa</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>Mesa {order.mesa_numero}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(order.estado)}
                      color={getStatusColor(order.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => setTicketDialog({ open: true, order })}
                      title="Ver ticket"
                    >
                      <Print />
                    </IconButton>
                    {order.estado === 'borrador' && (
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/order-edit/${order.id}`)}
                        title="Editar pedido"
                      >
                        <Edit />
                      </IconButton>
                    )}
                    {canChangeStatus(order.estado) && (
                      <IconButton
                        color="secondary"
                        onClick={() => setStatusDialog({
                          open: true,
                          orderId: order.id,
                          newStatus: getNextStatuses(order.estado)[0]?.value || ''
                        })}
                        title="Cambiar estado"
                      >
                        <PlayArrow />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteOrder(order.id)}
                      title="Eliminar pedido"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={statusDialog.open}
        onClose={() => setStatusDialog({ open: false, orderId: null, newStatus: '' })}
      >
        <DialogTitle>Cambiar Estado del Pedido</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Nuevo Estado"
            value={statusDialog.newStatus}
            onChange={(e) => setStatusDialog({ ...statusDialog, newStatus: e.target.value })}
            sx={{ mt: 2 }}
          >
            {getNextStatuses(orders.find(o => o.id === statusDialog.orderId)?.estado || '').map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog({ open: false, orderId: null, newStatus: '' })}>
            Cancelar
          </Button>
          <Button onClick={handleStatusChange} variant="contained">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={ticketDialog.open}
        onClose={() => setTicketDialog({ open: false, order: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ticket del Pedido #{ticketDialog.order?.id}</DialogTitle>
        <DialogContent>
          {ticketDialog.order && (
            <Box sx={{ fontFamily: 'monospace', whiteSpace: 'pre-line' }}>
              <Typography variant="h6" align="center" gutterBottom>
                Restaurante XYZ
              </Typography>
              <Typography align="center" gutterBottom>
                Fecha: {new Date(ticketDialog.order.created_at).toLocaleString()}
              </Typography>
              <Typography align="center" gutterBottom>
                Mesa: {ticketDialog.order.mesa_numero}
              </Typography>
              <Typography align="center" gutterBottom>
                Mesero: {ticketDialog.order.mesero_nombre}
              </Typography>
              <hr />
              {ticketDialog.order.detalles?.map((detalle, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>
                    {detalle.plato_nombre} x{detalle.cantidad}
                  </Typography>
                  <Typography>
                    ${(detalle.precio_unitario * detalle.cantidad).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <hr />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography>Total:</Typography>
                <Typography>${ticketDialog.order.total}</Typography>
              </Box>
              <Typography align="center" sx={{ mt: 2, fontSize: '0.8em' }}>
                ¡Gracias por su visita!
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.print()}>
            Imprimir
          </Button>
          <Button onClick={() => setTicketDialog({ open: false, order: null })}>
            Cerrar
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

export default OrderManagementWaiter;

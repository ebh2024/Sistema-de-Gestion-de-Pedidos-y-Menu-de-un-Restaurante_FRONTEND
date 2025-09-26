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
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { ExpandMore, ExpandLess, PlayArrow } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderViewCook = () => {
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
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (user?.rol !== 'cocinero') {
      navigate('/dashboard');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      // Filter orders that are not borrador or servido
      const activeOrders = response.data.filter(order =>
        ['pendiente', 'en preparación'].includes(order.estado)
      );
      setOrders(activeOrders);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'warning';
      case 'en preparación': return 'info';
      case 'servido': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'en preparación': return 'En Preparación';
      case 'servido': return 'Servido';
      default: return status;
    }
  };

  const canChangeStatus = (currentStatus) => {
    // Cooks can change pendiente to en preparación, en preparación to servido
    return ['pendiente', 'en preparación'].includes(currentStatus);
  };

  const getNextStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'pendiente': return [{ value: 'en preparación', label: 'Iniciar Preparación' }];
      case 'en preparación': return [{ value: 'servido', label: 'Marcar como Listo' }];
      default: return [];
    }
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
          Pedidos en Cocina
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Gestiona los pedidos pendientes y en preparación
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No hay pedidos activos en cocina
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Mesa</TableCell>
                <TableCell>Mesero</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>Mesa {order.mesa_numero}</TableCell>
                    <TableCell>{order.mesero_nombre}</TableCell>
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
                        onClick={() => toggleExpandOrder(order.id)}
                        size="small"
                      >
                        {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {canChangeStatus(order.estado) && (
                        <IconButton
                          color="primary"
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
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 0 }}>
                      <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Detalles del Pedido
                          </Typography>
                          <List dense>
                            {order.detalles?.map((detalle, index) => (
                              <ListItem key={index}>
                                <ListItemText
                                  primary={`${detalle.plato_nombre} x ${detalle.cantidad}`}
                                  secondary={`Precio unitario: $${detalle.precio_unitario}`}
                                />
                              </ListItem>
                            )) || (
                              <ListItem>
                                <ListItemText primary="No hay detalles disponibles" />
                              </ListItem>
                            )}
                          </List>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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

export default OrderViewCook;

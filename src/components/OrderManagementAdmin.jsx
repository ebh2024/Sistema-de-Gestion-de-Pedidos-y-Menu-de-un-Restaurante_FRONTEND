import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
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
  ListItemText,
  InputAdornment
} from '@mui/material';
import { Edit, Delete, PlayArrow, ExpandMore, ExpandLess, Search } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderManagementAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
    if (user?.rol !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  useEffect(() => {
    // Filter orders based on search term
    const filtered = orders.filter(order =>
      order.id.toString().includes(searchTerm) ||
      order.mesa_numero.toString().includes(searchTerm) ||
      order.mesero_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.estado.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [orders, searchTerm]);

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
    if (!window.confirm('¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.')) return;

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

  const getAllStatuses = () => [
    { value: 'borrador', label: 'Borrador' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en preparación', label: 'En Preparación' },
    { value: 'servido', label: 'Servido' }
  ];

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
          Gestión de Pedidos - Administrador
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Control total sobre todos los pedidos del restaurante
        </Typography>

        <Box sx={{ mt: 3, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por ID, mesa, mesero o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {filteredOrders.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {orders.length === 0 ? 'No hay pedidos registrados' : 'No se encontraron pedidos con los criterios de búsqueda'}
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
              {filteredOrders.map((order) => (
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
                      <IconButton
                        color="primary"
                        onClick={() => setStatusDialog({
                          open: true,
                          orderId: order.id,
                          newStatus: order.estado
                        })}
                        title="Cambiar estado"
                      >
                        <PlayArrow />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => navigate(`/order-edit/${order.id}`)}
                        title="Editar pedido"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Eliminar pedido"
                      >
                        <Delete />
                      </IconButton>
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
                                  secondary={`Precio unitario: $${detalle.precio_unitario} | Subtotal: $${(detalle.precio_unitario * detalle.cantidad).toFixed(2)}`}
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
            {getAllStatuses().map((status) => (
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

export default OrderManagementAdmin;

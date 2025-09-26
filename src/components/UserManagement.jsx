import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete, PersonAdd } from '@mui/icons-material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    rol: 'mesero'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error al cargar usuarios', 'error');
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        contraseña: '',
        rol: user.rol
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: '',
        correo: '',
        contraseña: '',
        rol: 'mesero'
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingUser(null);
    setFormData({
      nombre: '',
      correo: '',
      contraseña: '',
      rol: 'mesero'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingUser
        ? `http://localhost:3000/api/users/${editingUser.id}`
        : 'http://localhost:3000/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const submitData = editingUser
        ? { nombre: formData.nombre, correo: formData.correo, rol: formData.rol, is_active: editingUser.is_active }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        showSnackbar(editingUser ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente', 'success');
        fetchUsers();
        handleCloseDialog();
      } else {
        const error = await response.json();
        showSnackbar(error.message || 'Error al guardar usuario', 'error');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar('Error al guardar usuario', 'error');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          showSnackbar('Usuario eliminado exitosamente', 'success');
          fetchUsers();
        } else {
          const error = await response.json();
          showSnackbar(error.message || 'Error al eliminar usuario', 'error');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        showSnackbar('Error al eliminar usuario', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getRoleColor = (rol) => {
    switch (rol) {
      case 'admin': return 'error';
      case 'cocinero': return 'warning';
      case 'mesero': return 'info';
      default: return 'default';
    }
  };

  const getRoleLabel = (rol) => {
    switch (rol) {
      case 'admin': return 'Admin';
      case 'cocinero': return 'Cocinero';
      case 'mesero': return 'Mesero';
      default: return rol;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Administra los usuarios del sistema
        </Typography>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => handleOpenDialog()}
          >
            Crear Usuario
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.correo}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(user.rol)}
                      color={getRoleColor(user.rol)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Activo' : 'Inactivo'}
                      color={user.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuario' : 'Crear Usuario'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Correo"
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              margin="normal"
              required
            />
            {!editingUser && (
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formData.contraseña}
                onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                margin="normal"
                required
              />
            )}
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                label="Rol"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="cocinero">Cocinero</MenuItem>
                <MenuItem value="mesero">Mesero</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
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

export default UserManagement;

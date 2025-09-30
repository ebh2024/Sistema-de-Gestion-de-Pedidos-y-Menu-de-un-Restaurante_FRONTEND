import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { useDishes } from './DishContext';
import { useOrders } from './OrderContext';

function Snackbar() {
  const { snackbar: dishSnackbar, setSnackbar: setDishSnackbar } = useDishes();
  const { snackbar: orderSnackbar, setSnackbar: setOrderSnackbar } = useOrders();

  // Use whichever snackbar is open, prioritizing order snackbar
  const snackbar = orderSnackbar.open ? orderSnackbar : dishSnackbar;
  const setSnackbar = orderSnackbar.open ? setOrderSnackbar : setDishSnackbar;

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <MuiSnackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </MuiSnackbar>
  );
}

export default Snackbar;

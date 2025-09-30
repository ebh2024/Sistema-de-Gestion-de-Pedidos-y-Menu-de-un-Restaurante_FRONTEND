import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { useDishes } from './DishContext';

function Snackbar() {
  const { snackbar, setSnackbar } = useDishes();

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

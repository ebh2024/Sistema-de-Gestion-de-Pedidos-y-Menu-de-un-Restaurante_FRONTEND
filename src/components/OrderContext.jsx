import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Load from localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
      total: calculateTotal(order.items)
    };
    setOrders([...orders, newOrder]);
    showSnackbar('Pedido creado exitosamente');
    return newOrder.id;
  };

  const updateOrderStatus = (id, status) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status } : order
    ));
    showSnackbar(`Pedido ${status.toLowerCase()}`, 'info');
  };

  const cancelOrder = (id) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: 'Cancelado' } : order
    ));
    showSnackbar('Pedido cancelado', 'warning');
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getOrderById = (id) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      setLoading,
      snackbar,
      setSnackbar,
      addOrder,
      updateOrderStatus,
      cancelOrder,
      calculateTotal,
      getOrdersByStatus,
      getOrderById
    }}>
      {children}
    </OrderContext.Provider>
  );
};

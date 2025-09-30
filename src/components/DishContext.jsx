import React, { createContext, useContext, useState, useEffect } from 'react';

const DishContext = createContext();

export const useDishes = () => {
  const context = useContext(DishContext);
  if (!context) {
    throw new Error('useDishes must be used within a DishProvider');
  }
  return context;
};

export const DishProvider = ({ children }) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Load from localStorage
    const savedDishes = localStorage.getItem('dishes');
    if (savedDishes) {
      setDishes(JSON.parse(savedDishes));
    } else {
      // Add sample data if none exists
      const sampleDishes = [
        { id: 1, name: 'Pizza Margherita', description: 'Pizza clásica con tomate, mozzarella y albahaca', price: 12.99, available: true },
        { id: 2, name: 'Hamburguesa Clásica', description: 'Hamburguesa con queso, lechuga y tomate', price: 9.99, available: true },
        { id: 3, name: 'Pasta Carbonara', description: 'Pasta con salsa carbonara tradicional', price: 11.50, available: true },
        { id: 4, name: 'Ensalada César', description: 'Ensalada con pollo, crutones y aderezo césar', price: 8.75, available: true },
        { id: 5, name: 'Tiramisú', description: 'Postre italiano clásico', price: 6.50, available: true },
        { id: 6, name: 'Refresco', description: 'Bebida gaseosa 330ml', price: 2.50, available: true }
      ];
      setDishes(sampleDishes);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('dishes', JSON.stringify(dishes));
  }, [dishes]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const addDish = (dish) => {
    setDishes([...dishes, { ...dish, id: Date.now() }]);
    showSnackbar('Plato agregado exitosamente');
  };

  const updateDish = (id, updatedDish) => {
    setDishes(dishes.map(dish => dish.id === id ? { ...dish, ...updatedDish } : dish));
    showSnackbar('Plato actualizado exitosamente');
  };

  const deleteDish = (id) => {
    setDishes(dishes.filter(dish => dish.id !== id));
    showSnackbar('Plato eliminado exitosamente', 'info');
  };

  const toggleAvailability = (id) => {
    const dish = dishes.find(d => d.id === id);
    setDishes(dishes.map(dish => dish.id === id ? { ...dish, available: !dish.available } : dish));
    showSnackbar(`Plato ${dish.available ? 'deshabilitado' : 'habilitado'}`, 'info');
  };

  return (
    <DishContext.Provider value={{
      dishes,
      loading,
      setLoading,
      snackbar,
      setSnackbar,
      addDish,
      updateDish,
      deleteDish,
      toggleAvailability
    }}>
      {children}
    </DishContext.Provider>
  );
};

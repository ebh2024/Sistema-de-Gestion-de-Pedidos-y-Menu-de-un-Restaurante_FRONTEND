import React, { createContext, useContext, useState, useEffect } from 'react';

const TableContext = createContext();

export const useTables = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTables must be used within a TableProvider');
  }
  return context;
};

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Load from localStorage
    const savedTables = localStorage.getItem('tables');
    if (savedTables) {
      setTables(JSON.parse(savedTables));
    } else {
      // Add sample data if none exists
      const sampleTables = [
        { id: 1, number: 1, seats: 4, available: true },
        { id: 2, number: 2, seats: 2, available: true },
        { id: 3, number: 3, seats: 6, available: true },
        { id: 4, number: 4, seats: 4, available: true },
        { id: 5, number: 5, seats: 8, available: true },
        { id: 6, number: 6, seats: 2, available: true }
      ];
      setTables(sampleTables);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('tables', JSON.stringify(tables));
  }, [tables]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const addTable = (table) => {
    setTables([...tables, { ...table, id: Date.now(), available: true }]);
    showSnackbar('Mesa agregada exitosamente');
  };

  const updateTable = (id, updatedTable) => {
    setTables(tables.map(table => table.id === id ? { ...table, ...updatedTable } : table));
    showSnackbar('Mesa actualizada exitosamente');
  };

  const deleteTable = (id) => {
    setTables(tables.filter(table => table.id !== id));
    showSnackbar('Mesa eliminada exitosamente', 'info');
  };

  const toggleAvailability = (id) => {
    const table = tables.find(t => t.id === id);
    setTables(tables.map(table => table.id === id ? { ...table, available: !table.available } : table));
    showSnackbar(`Mesa ${table.available ? 'ocupada' : 'liberada'}`, 'info');
  };

  return (
    <TableContext.Provider value={{
      tables,
      loading,
      setLoading,
      snackbar,
      setSnackbar,
      addTable,
      updateTable,
      deleteTable,
      toggleAvailability
    }}>
      {children}
    </TableContext.Provider>
  );
};

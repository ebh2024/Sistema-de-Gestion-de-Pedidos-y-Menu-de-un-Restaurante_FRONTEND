import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401/403 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid or expired, clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Dispatch custom event to notify auth context
      window.dispatchEvent(new CustomEvent('auth-error', {
        detail: { status: error.response.status, message: 'Sesión expirada o inválida' }
      }));

      // Redirect to login if not already there
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

class ApiService {
  constructor() {
    this.client = apiClient;
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async forgotPassword(data) {
    const response = await this.client.post('/auth/forgot-password', data);
    return response.data;
  }

  async resetPassword(data) {
    const response = await this.client.post('/auth/reset-password', data);
    return response.data;
  }

  // User methods
  async getUsers() {
    const response = await this.client.get('/users');
    return response.data;
  }

  async createUser(userData) {
    const response = await this.client.post('/users', userData);
    return response.data;
  }

  async updateUser(id, userData) {
    const response = await this.client.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id) {
    const response = await this.client.delete(`/users/${id}`);
    return response.data;
  }

  // Dish methods
  async getDishes() {
    const response = await this.client.get('/dishes');
    return response.data;
  }

  async createDish(dishData) {
    const response = await this.client.post('/dishes', dishData);
    return response.data;
  }

  async updateDish(id, dishData) {
    const response = await this.client.put(`/dishes/${id}`, dishData);
    return response.data;
  }

  async deleteDish(id) {
    const response = await this.client.delete(`/dishes/${id}`);
    return response.data;
  }

  // Table methods
  async getTables() {
    const response = await this.client.get('/tables');
    return response.data;
  }

  async createTable(tableData) {
    const response = await this.client.post('/tables', tableData);
    return response.data;
  }

  async updateTable(id, tableData) {
    const response = await this.client.put(`/tables/${id}`, tableData);
    return response.data;
  }

  async deleteTable(id) {
    const response = await this.client.delete(`/tables/${id}`);
    return response.data;
  }

  // Order methods
  async getOrders() {
    const response = await this.client.get('/orders');
    return response.data;
  }

  async createOrder(orderData) {
    const response = await this.client.post('/orders', orderData);
    return response.data;
  }

  async updateOrder(id, orderData) {
    const response = await this.client.put(`/orders/${id}`, orderData);
    return response.data;
  }

  async deleteOrder(id) {
    const response = await this.client.delete(`/orders/${id}`);
    return response.data;
  }
}

export default new ApiService();

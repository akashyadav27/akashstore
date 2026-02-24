import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getUserProfile = () => API.get('/auth/profile');

// Products
export const getProducts = (search = '', category = '') =>
  API.get(`/products?search=${search}&category=${category}`);
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders');
export const deliverOrder = (id) => API.put(`/orders/${id}/deliver`);
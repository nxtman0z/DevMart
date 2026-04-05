import api from './index';

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    return api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  changePassword: (data) => api.put('/users/change-password', data),
  updatePayout: (data) => api.put('/users/payout', data),
};

// Product API
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (formData) =>
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/seller/my-products'),
};

// Order API
export const orderAPI = {
  create: (productId) => api.post('/orders/create', { productId }),
  verify: (data) => api.post('/orders/verify', data),
  getMyPurchases: () => api.get('/orders/my-purchases'),
  getSellerSales: () => api.get('/orders/seller/sales'),
};

// Review API
export const reviewAPI = {
  create: (productId, data) => api.post(`/reviews/${productId}`, data),
  getByProduct: (productId) => api.get(`/reviews/${productId}`),
};

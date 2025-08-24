

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = (includeAuth = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (data: { email: string; resetToken: string; newPassword: string }) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },
  
  getFeatured: async () => {
    return apiRequest('/products/featured');
  },
  
  getById: async (id: string) => {
    return apiRequest(`/products/${id}`);
  },
  
  create: async (productData: any) => {
    console.log('Creating product with data:', productData);
    return apiRequest('/products', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${getAuthToken()}` 
      },
      body: JSON.stringify(productData),
    });
  },
  
  update: async (id: string, productData: any) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(productData),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
};

// Cart API
export const cartAPI = {
  add: async (productId: string, quantity: number = 1) => {
    return apiRequest('/cart/add', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify({ productId, quantity }),
    });
  },
  
  get: async () => {
    return apiRequest('/cart', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
  
  update: async (productId: string, quantity: number) => {
    return apiRequest('/cart/update', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify({ productId, quantity }),
    });
  },
  
  remove: async (productId: string) => {
    return apiRequest(`/cart/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },

  clear: async () => {
    return apiRequest('/cart/clear', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
};

// Favorites API
export const favoritesAPI = {
  add: async (productId: string) => {
    return apiRequest('/favorites/add', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify({ productId }),
    });
  },
  
  remove: async (productId: string) => {
    return apiRequest(`/favorites/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
  
  get: async () => {
    return apiRequest('/favorites', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
};

// Notifications API
export const notificationsAPI = {
  create: async (notificationData: { title: string; message: string; type?: string }) => {
    return apiRequest('/notifications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(notificationData),
    });
  },
  
  getAll: async () => {
    return apiRequest('/notifications');
  },
  
  update: async (id: string, notificationData: any) => {
    return apiRequest(`/notifications/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(notificationData),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: any) => {
    return apiRequest('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(orderData),
    });
  },
  
  getMyOrders: async () => {
    return apiRequest('/orders/myorders', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },

  getAll: async () => {
    return apiRequest('/orders/all', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
  
  getById: async (id: string) => {
    return apiRequest(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
  
  updateToPaid: async (id: string, paymentResult: any) => {
    return apiRequest(`/orders/${id}/pay`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify(paymentResult),
    });
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify({ status }),
    });
  },

  // New methods for admin approval workflow
  approveReception: async (id: string, approved: boolean, adminComments?: string) => {
    return apiRequest(`/orders/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify({ approved, adminComments }),
    });
  },

  getPendingApproval: async () => {
    return apiRequest('/orders/pending-approval', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
};

// Newsletter API
export const newsletterAPI = {
  subscribe: async (email: string) => {
    return apiRequest('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  
  unsubscribe: async (email: string) => {
    return apiRequest('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  
  getSubscribers: async () => {
    return apiRequest('/newsletter', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (includeInactive = false) => {
    try {
      console.log('🌐 API Request: GET categories');
      const searchParams = new URLSearchParams();
      if (includeInactive) searchParams.append('includeInactive', 'true');
      
      const queryString = searchParams.toString();
      const response = await apiRequest(`/categories${queryString ? `?${queryString}` : ''}`);
      console.log('🌐 API Response: categories', response);
      return response;
    } catch (error) {
      console.error('❌ Categories API Error:', error);
      return { success: false, message: error.message };
    }
  },

  create: async (categoryData: any) => {
    try {
      console.log('🌐 API Request: POST category', categoryData);
      
      return apiRequest('/categories', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${getAuthToken()}` 
        },
        body: JSON.stringify(categoryData),
      });
    } catch (error) {
      console.error('❌ Create Category API Error:', error);
      throw error;
    }
  },

  update: async (id: string, categoryData: any) => {
    try {
      console.log('🌐 API Request: PUT category', id, categoryData);
      
      return apiRequest(`/categories/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify(categoryData),
      });
    } catch (error) {
      console.error('❌ Update Category API Error:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      console.log('🌐 API Request: DELETE category', id);
      
      return apiRequest(`/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
    } catch (error) {
      console.error('❌ Delete Category API Error:', error);
      throw error;
    }
  }
};

export const userNotificationsAPI = {
  get: async () => {
    return apiRequest('/user-notifications', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
  
  markAsRead: async (notificationId: string) => {
    return apiRequest(`/user-notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  },
  
  add: async (userId: string, title: string, message: string, type?: string) => {
    return apiRequest('/user-notifications/add', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: JSON.stringify({ userId, title, message, type }),
    });
  },
};
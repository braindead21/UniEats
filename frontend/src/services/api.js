const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    console.log('API Request:', { url, config, body: options.body });

    try {
      const response = await fetch(url, config);
      console.log('API Response:', response);
      
      const data = await response.json();
      console.log('API Response Data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // HTTP method helpers
  get(endpoint, options = {}) {
    const { params, ...otherOptions } = options;
    let url = endpoint;
    
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    
    return this.request(url, {
      method: 'GET',
      ...otherOptions
    });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    });
  }

  // Authentication endpoints
  auth = {
    login: (credentials) => this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
    register: (userData) => this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
    getProfile: () => this.request('/auth/me'),
    
    updateProfile: (profileData) => this.request('/auth/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
    
    updatePassword: (passwordData) => this.request('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    }),
    
    logout: () => this.request('/auth/logout'),
  };

  // Restaurant endpoints
  restaurants = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/restaurants${queryString ? `?${queryString}` : ''}`);
    },
    
    getById: (id) => this.request(`/restaurants/${id}`),
    
    create: (restaurantData) => this.request('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    }),
    
    update: (id, restaurantData) => this.request(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(restaurantData),
    }),
    
    delete: (id) => this.request(`/restaurants/${id}`, {
      method: 'DELETE',
    }),
    
    search: (query) => this.request(`/restaurants/search?q=${encodeURIComponent(query)}`),
  };

  // Menu endpoints
  menu = {
    getByRestaurant: (restaurantId) => this.request(`/menu/restaurant/${restaurantId}`),
    
    getItem: (itemId) => this.request(`/menu/${itemId}`),
    
    create: (menuData) => this.request('/menu', {
      method: 'POST',
      body: JSON.stringify(menuData),
    }),
    
    update: (itemId, menuData) => this.request(`/menu/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(menuData),
    }),
    
    delete: (itemId) => this.request(`/menu/${itemId}`, {
      method: 'DELETE',
    }),
  };

  // Order endpoints
  orders = {
    getAll: () => this.request('/orders'),
    
    getById: (orderId) => this.request(`/orders/${orderId}`),
    
    create: (orderData) => this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
    
    updateStatus: (orderId, status) => this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
    
    getByUser: (userId) => this.request(`/orders/user/${userId}`),
    
    getByRestaurant: (restaurantId) => this.request(`/orders/restaurant/${restaurantId}`),
  };

  // Delivery Partner endpoints
  partner = {
    register: (partnerData) => this.request('/partner/register', {
      method: 'POST',
      body: JSON.stringify(partnerData),
    }),
    
    getProfile: () => this.request('/partner/profile'),
    
    updateLocation: (locationData) => this.request('/partner/location', {
      method: 'PUT',
      body: JSON.stringify(locationData),
    }),
    
    getAvailableOrders: () => this.request('/partner/available-orders'),
    
    acceptOrder: (orderId) => this.request(`/partner/accept-order/${orderId}`, {
      method: 'POST',
    }),
    
    completeDelivery: (orderId) => this.request(`/partner/complete-delivery/${orderId}`, {
      method: 'POST',
    }),
  };
}

const api = new ApiService();
export { api };
export default api;

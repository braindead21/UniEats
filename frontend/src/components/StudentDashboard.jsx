import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { cartItems, getCartCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchStudentData();
    
    // Set up real-time refresh every 60 seconds for student dashboard
    const interval = setInterval(() => {
      fetchStudentData();
    }, 60000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const ordersRes = await api.get('/orders');
      setOrders(ordersRes.orders || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'confirmed': return '#2196f3';
      case 'preparing': return '#ff9800';
      case 'out_for_delivery': return '#9c27b0';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="student-dashboard">
        <div className="dashboard-loading">
          <h2>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);
  const totalSpent = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
  const favoriteRestaurant = orders.length > 0 ? 
    orders.reduce((acc, order) => {
      const restaurant = order.restaurant?.name || 'Unknown';
      acc[restaurant] = (acc[restaurant] || 0) + 1;
      return acc;
    }, {}) : {};
  
  const topRestaurant = Object.keys(favoriteRestaurant).length > 0 ? 
    Object.keys(favoriteRestaurant).reduce((a, b) => favoriteRestaurant[a] > favoriteRestaurant[b] ? a : b) : 'None';

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>👨‍🎓 Welcome back, {user?.name}!</h1>
        <p>Track your orders and discover amazing food</p>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{totalSpent}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>{getCartCount()}</h3>
            <p>Items in Cart</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <h3>{topRestaurant}</h3>
            <p>Favorite Restaurant</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`dashboard-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 My Orders ({orders.length})
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ❤️ Favorites
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="dashboard-content">
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h2>{user?.name}</h2>
                  <p>{user?.email}</p>
                  <span className="profile-role">Student</span>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="detail-row">
                    <span className="detail-label">📱 Phone:</span>
                    <span className="detail-value">{user?.phone}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">🎓 Role:</span>
                  <span className="detail-value">Student</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📅 Joined:</span>
                  <span className="detail-value">
                    {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
                  </span>
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="profile-btn primary">
                  ✏️ Edit Profile
                </button>
                <button className="profile-btn secondary">
                  🔒 Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="dashboard-content">
          <div className="orders-section">
            <div className="section-header">
              <h2>📦 Your Orders</h2>
              <button className="refresh-btn" onClick={fetchStudentData}>
                🔄 Refresh
              </button>
            </div>
            
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>No orders yet!</h3>
                <p>When you place orders, they will appear here.</p>
                <button className="cta-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                  🛒 Start Ordering
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.orderNumber}</h3>
                        <p className="order-restaurant">{order.restaurant?.name}</p>
                        <span className="order-date">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="order-total">₹{order.pricing?.total}</span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item">
                          <span className="item-name">{item.quantity}x {item.name}</span>
                          <span className="item-price">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    {order.deliveryAddress && (
                      <div className="order-address">
                        <span className="address-label">📍 Delivery to:</span>
                        <span className="address-text">
                          {order.deliveryAddress.name}, {order.deliveryAddress.street}
                        </span>
                      </div>
                    )}
                    
                    <div className="order-actions">
                      <button className="order-btn secondary">
                        📋 View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button className="order-btn primary">
                          🔄 Reorder
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button className="order-btn danger">
                          ❌ Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="dashboard-content">
          <div className="favorites-section">
            <div className="section-header">
              <h2>❤️ Your Favorites</h2>
            </div>
            
            <div className="empty-state">
              <div className="empty-icon">❤️</div>
              <h3>No favorites yet!</h3>
              <p>Add items to favorites while browsing restaurants.</p>
              <button className="cta-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                🍽️ Explore Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const RestaurantOwnerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, ordersRes, menuRes] = await Promise.all([
        api.get('/restaurant-owner/dashboard'),
        api.get('/restaurant-owner/orders'),
        api.get('/restaurant-owner/menu')
      ]);

      setDashboardData(dashboardRes.data);
      setOrders(ordersRes.data || []);
      setMenuItems(menuRes.data || []);
    } catch (error) {
      console.error('Error fetching restaurant dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/restaurant-owner/orders/${orderId}/status`, { status });
      await fetchDashboardData(); // Refresh data
      alert(`Order status updated to ${status}!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const toggleMenuItemAvailability = async (itemId, isAvailable) => {
    try {
      await api.put(`/restaurant-owner/menu/${itemId}/availability`, { isAvailable });
      await fetchDashboardData(); // Refresh data
      alert(`Menu item ${isAvailable ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error('Error updating menu item availability:', error);
      alert('Failed to update menu item availability');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'confirmed': return '#2196f3';
      case 'preparing': return '#ff9800';
      case 'ready_for_pickup': return '#9c27b0';
      case 'picked_up': return '#4caf50';
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
      <div className="restaurant-dashboard">
        <div className="dashboard-loading">
          <h2>Loading Restaurant Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-dashboard">
      <div className="dashboard-header">
        <h1>🏪 Restaurant Dashboard</h1>
        <p>Welcome back, {user?.name}! Manage your restaurant efficiently</p>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders ({orders.length})
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          🍽️ Menu ({menuItems.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="dashboard-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{dashboardData.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{dashboardData.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>₹{dashboardData.totalRevenue}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <h3>₹{dashboardData.todayRevenue}</h3>
                <p>Today's Revenue</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🍽️</div>
              <div className="stat-info">
                <h3>{dashboardData.menuItemsCount}</h3>
                <p>Menu Items</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>{dashboardData.averageRating}</h3>
                <p>Average Rating</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="recent-orders-section">
            <h2>🕒 Recent Orders</h2>
            <div className="recent-orders-list">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="recent-order-card">
                  <div className="order-info">
                    <h4>Order #{order.orderNumber}</h4>
                    <p>{order.user?.name} • {order.items?.length} items</p>
                    <span className="order-time">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-status-section">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="order-total">₹{order.pricing?.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="dashboard-content">
          <div className="orders-section">
            <div className="section-header">
              <h2>📦 Order Management</h2>
              <button className="refresh-btn" onClick={fetchDashboardData}>
                🔄 Refresh
              </button>
            </div>
            
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No orders yet!</h3>
                <p>Orders from customers will appear here.</p>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map((order) => (
                  <div key={order._id} className="order-management-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.orderNumber}</h3>
                        <p className="customer-info">
                          👤 {order.user?.name} • 📱 {order.user?.phone}
                        </p>
                        <span className="order-time">📅 {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-status-section">
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
                      <h4>Items:</h4>
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item">
                          <span className="item-details">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="item-price">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    {order.deliveryAddress && (
                      <div className="delivery-info">
                        <h4>📍 Delivery Address:</h4>
                        <p>
                          {order.deliveryAddress.name}<br/>
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}
                          {order.deliveryAddress.landmark && `, ${order.deliveryAddress.landmark}`}
                        </p>
                      </div>
                    )}
                    
                    <div className="order-actions">
                      {order.status === 'pending' && (
                        <>
                          <button 
                            className="action-btn confirm"
                            onClick={() => updateOrderStatus(order._id, 'confirmed')}
                          >
                            ✅ Confirm Order
                          </button>
                          <button 
                            className="action-btn reject"
                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                          >
                            ❌ Reject Order
                          </button>
                        </>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <button 
                          className="action-btn preparing"
                          onClick={() => updateOrderStatus(order._id, 'preparing')}
                        >
                          👨‍🍳 Start Preparing
                        </button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <button 
                          className="action-btn ready"
                          onClick={() => updateOrderStatus(order._id, 'ready_for_pickup')}
                        >
                          ✅ Ready for Pickup
                        </button>
                      )}
                      
                      {order.status === 'ready_for_pickup' && (
                        <button 
                          className="action-btn pickup"
                          onClick={() => updateOrderStatus(order._id, 'picked_up')}
                        >
                          🚚 Picked Up
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

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="dashboard-content">
          <div className="menu-section">
            <div className="section-header">
              <h2>🍽️ Menu Management</h2>
              <div className="header-actions">
                <button className="add-item-btn">
                  ➕ Add New Item
                </button>
                <button className="refresh-btn" onClick={fetchDashboardData}>
                  🔄 Refresh
                </button>
              </div>
            </div>
            
            {menuItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>No menu items!</h3>
                <p>Add items to your menu to start receiving orders.</p>
                <button className="cta-btn">
                  ➕ Add First Item
                </button>
              </div>
            ) : (
              <div className="menu-grid">
                {menuItems.map((item) => (
                  <div key={item._id} className="menu-item-card">
                    <div className="item-image">
                      <img 
                        src={item.image || '/placeholder-food.jpg'} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-food.jpg';
                        }}
                      />
                      <div className="availability-toggle">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={item.isAvailable}
                            onChange={(e) => toggleMenuItemAvailability(item._id, e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-meta">
                        <span className="item-category">🏷️ {item.category}</span>
                        <span className="item-price">₹{item.price}</span>
                      </div>
                      <div className="item-status">
                        <span className={`availability-badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
                          {item.isAvailable ? '✅ Available' : '❌ Unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button className="edit-btn">
                        ✏️ Edit
                      </button>
                      <button className="delete-btn">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantOwnerDashboard;

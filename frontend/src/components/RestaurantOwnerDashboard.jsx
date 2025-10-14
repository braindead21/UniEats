import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import './RestaurantOwnerDashboard.css';
import { 
  FiPackage, FiClock, FiDollarSign, FiTrendingUp, 
  FiRefreshCw, FiCheck, FiX, FiEdit, FiTrash2,
  FiPlus, FiEye, FiBarChart, FiUsers
} from 'react-icons/fi';
import { 
  BiRestaurant, BiUser 
} from 'react-icons/bi';
import { 
  MdOutlineRestaurantMenu, MdDeliveryDining,
  MdOutlineStarRate, MdOutlineKitchen
} from 'react-icons/md';
import { 
  RiRestaurantLine 
} from 'react-icons/ri';

const RestaurantOwnerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, menuRes] = await Promise.all([
        api.get('/restaurant-owner/stats'),
        api.get('/restaurant-owner/orders'),
        api.get('/restaurant-owner/menu')
      ]);

      if (statsRes.success) {
        setDashboardData({ stats: statsRes.stats });
      }
      setOrders(ordersRes.orders || []);
      setMenuItems(menuRes.menu || []);
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
      await api.put(`/restaurant-owner/menu/${itemId}/availability`, { available: isAvailable });
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
        <h1><BiRestaurant className="header-icon" /> Restaurant Dashboard</h1>
        <p>Welcome back, {user?.name}! Manage your restaurant efficiently</p>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FiBarChart className="tab-icon" /> Overview
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FiPackage className="tab-icon" /> Orders ({orders.length})
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <MdOutlineRestaurantMenu className="tab-icon" /> Menu ({menuItems.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="dashboard-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><FiPackage /></div>
              <div className="stat-info">
                <h3>{dashboardData.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon"><FiClock /></div>
              <div className="stat-info">
                <h3>{dashboardData.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon"><FiDollarSign /></div>
              <div className="stat-info">
                <h3>₹{dashboardData.totalRevenue}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon"><FiTrendingUp /></div>
              <div className="stat-info">
                <h3>₹{dashboardData.todayRevenue}</h3>
                <p>Today's Revenue</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon"><MdOutlineRestaurantMenu /></div>
              <div className="stat-info">
                <h3>{dashboardData.menuItemsCount}</h3>
                <p>Menu Items</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon"><MdOutlineStarRate /></div>
              <div className="stat-info">
                <h3>{dashboardData.averageRating}</h3>
                <p>Average Rating</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="recent-orders-section">
            <h2><FiClock className="section-icon" /> Recent Orders</h2>
            <div className="recent-orders-list">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="recent-order-card">
                  <div className="order-info">
                    <h4>Order #{order.orderNumber}</h4>
                    <p><BiUser className="inline-icon" /> {order.user?.name} • {order.items?.length} items</p>
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
              <h2><FiPackage className="section-icon" /> Order Management</h2>
              <button className="refresh-btn" onClick={fetchDashboardData}>
                <FiRefreshCw className="btn-icon" /> Refresh
              </button>
            </div>
            
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FiPackage /></div>
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
                          <BiUser className="inline-icon" /> {order.user?.name} • <FiUsers className="inline-icon" /> {order.user?.phone}
                        </p>
                        <span className="order-time"><FiClock className="inline-icon" /> {formatDate(order.createdAt)}</span>
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
                        <h4><MdDeliveryDining className="section-icon" /> Delivery Address:</h4>
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
                            <FiCheck className="btn-icon" /> Confirm Order
                          </button>
                          <button 
                            className="action-btn reject"
                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                          >
                            <FiX className="btn-icon" /> Reject Order
                          </button>
                        </>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <button 
                          className="action-btn preparing"
                          onClick={() => updateOrderStatus(order._id, 'preparing')}
                        >
                          <MdOutlineKitchen className="btn-icon" /> Start Preparing
                        </button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <button 
                          className="action-btn ready"
                          onClick={() => updateOrderStatus(order._id, 'ready_for_pickup')}
                        >
                          <FiCheck className="btn-icon" /> Ready for Pickup
                        </button>
                      )}
                      
                      {order.status === 'ready_for_pickup' && (
                        <button 
                          className="action-btn pickup"
                          onClick={() => updateOrderStatus(order._id, 'picked_up')}
                        >
                          <MdDeliveryDining className="btn-icon" /> Picked Up
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
              <h2><MdOutlineRestaurantMenu className="section-icon" /> Menu Management</h2>
              <div className="header-actions">
                <button className="add-item-btn">
                  <FiPlus className="btn-icon" /> Add New Item
                </button>
                <button className="refresh-btn" onClick={fetchDashboardData}>
                  <FiRefreshCw className="btn-icon" /> Refresh
                </button>
              </div>
            </div>
            
            {menuItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><MdOutlineRestaurantMenu /></div>
                <h3>No menu items!</h3>
                <p>Add items to your menu to start receiving orders.</p>
                <button className="cta-btn">
                  <FiPlus className="btn-icon" /> Add First Item
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
                          {item.isAvailable ? <><FiCheck className="status-icon" /> Available</> : <><FiX className="status-icon" /> Unavailable</>}
                        </span>
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button className="edit-btn">
                        <FiEdit className="btn-icon" /> Edit
                      </button>
                      <button className="delete-btn">
                        <FiTrash2 className="btn-icon" /> Delete
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

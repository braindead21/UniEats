import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import './DeliveryPartnerDashboard.css';

const DeliveryPartnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalDeliveries: 0,
    todayDeliveries: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    currentRating: 0,
    completedOrders: 0,
    availableOrders: []
  });
  
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time refresh every 15 seconds for delivery partners (more frequent due to time-sensitive nature)
    const interval = setInterval(() => {
      if (isOnline) {
        fetchDashboardData();
      }
    }, 15000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [isOnline]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch delivery partner stats
      const statsResponse = await api.get('/deliveryPartner/stats');
      if (statsResponse.success) {
        setDashboardStats(statsResponse.stats);
      }

      // Fetch available orders
      const ordersResponse = await api.get('/deliveryPartner/available-orders');
      if (ordersResponse.success) {
        setAvailableOrders(ordersResponse.orders || []);
      }

      // Fetch my deliveries
      const deliveriesResponse = await api.get('/deliveryPartner/my-deliveries');
      if (deliveriesResponse.success) {
        setMyDeliveries(deliveriesResponse.deliveries || []);
      }

      // Fetch earnings
      const earningsResponse = await api.get('/deliveryPartner/earnings');
      if (earningsResponse.success) {
        setEarnings(earningsResponse.earnings || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const response = await api.post('/deliveryPartner/toggle-online', {
        isOnline: !isOnline
      });
      
      if (response.success) {
        setIsOnline(!isOnline);
      }
    } catch (error) {
      console.error('Error toggling online status:', error);
      alert('Failed to update online status');
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      const response = await api.post(`/deliveryPartner/accept-order/${orderId}`);
      
      if (response.success) {
        alert('Order accepted successfully!');
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Failed to accept order');
    }
  };

  const updateDeliveryStatus = async (orderId, status) => {
    try {
      const response = await api.put(`/deliveryPartner/update-delivery/${orderId}`, {
        status
      });
      
      if (response.success) {
        alert('Delivery status updated successfully!');
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert('Failed to update delivery status');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'picked_up': return '#2196f3';
      case 'out_for_delivery': return '#ff9800';
      case 'delivered': return '#4caf50';
      case 'ready_for_pickup': return '#9c27b0';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <div className="delivery-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your delivery dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🏍️ Delivery Partner Dashboard</h1>
            <p className="welcome-text">
              Welcome back, {user?.name}! Ready to deliver some happiness?
            </p>
          </div>
          <div className="header-right">
            <div className="online-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isOnline}
                  onChange={toggleOnlineStatus}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className={`online-status ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
            <button className="refresh-btn" onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Available Orders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'deliveries' ? 'active' : ''}`}
            onClick={() => setActiveTab('deliveries')}
          >
            🚚 My Deliveries
          </button>
          <button 
            className={`tab-btn ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            💰 Earnings
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={fetchDashboardData}>Try Again</button>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="dashboard-content">
          <div className="stats-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Total Deliveries</h3>
                  <p className="stat-number">{dashboardStats.totalDeliveries}</p>
                  <span className="stat-label">All time</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🚚</div>
                <div className="stat-content">
                  <h3>Today's Deliveries</h3>
                  <p className="stat-number">{dashboardStats.todayDeliveries}</p>
                  <span className="stat-label">Today</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Total Earnings</h3>
                  <p className="stat-number">₹{dashboardStats.totalEarnings}</p>
                  <span className="stat-label">All time</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💵</div>
                <div className="stat-content">
                  <h3>Today's Earnings</h3>
                  <p className="stat-number">₹{dashboardStats.todayEarnings}</p>
                  <span className="stat-label">Today</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>Rating</h3>
                  <p className="stat-number">{dashboardStats.currentRating.toFixed(1)}</p>
                  <span className="stat-label">Average rating</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Completed Orders</h3>
                  <p className="stat-number">{dashboardStats.completedOrders}</p>
                  <span className="stat-label">Successfully delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Orders Tab */}
      {activeTab === 'orders' && (
        <div className="dashboard-content">
          <div className="orders-section">
            <div className="section-header">
              <h2>📦 Available Orders</h2>
              <div className="header-actions">
                {!isOnline && (
                  <div className="offline-notice">
                    <span>🔴 You're offline. Go online to see available orders!</span>
                  </div>
                )}
                <button className="refresh-btn" onClick={fetchDashboardData}>
                  🔄 Refresh
                </button>
              </div>
            </div>
            
            {availableOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>{isOnline ? 'No orders available!' : 'Go online to see orders'}</h3>
                <p>{isOnline ? 'New orders will appear here when available.' : 'Toggle your online status to start receiving orders.'}</p>
                {!isOnline && (
                  <button className="cta-btn" onClick={toggleOnlineStatus}>
                    🟢 Go Online
                  </button>
                )}
              </div>
            ) : (
              <div className="orders-grid">
                {availableOrders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.orderNumber}</h3>
                        <p className="order-time">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="order-amount">
                        <span className="delivery-fee">₹{order.deliveryFee || 40}</span>
                        <span className="fee-label">Delivery Fee</span>
                      </div>
                    </div>
                    
                    <div className="order-details">
                      <div className="restaurant-info">
                        <h4>🏪 {order.restaurant?.name}</h4>
                        <p>{order.restaurant?.address}</p>
                      </div>
                      
                      <div className="delivery-info">
                        <h4>📍 Delivery Address</h4>
                        <p>{order.deliveryAddress?.name}</p>
                        <p>{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
                        <p>📱 {order.deliveryAddress?.phone}</p>
                      </div>
                      
                      <div className="order-items">
                        <h4>🛒 Items ({order.items?.length})</h4>
                        <div className="items-list">
                          {order.items?.map((item, index) => (
                            <span key={index} className="item-tag">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => acceptOrder(order._id)}
                      >
                        ✅ Accept Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <div className="dashboard-content">
          <div className="deliveries-section">
            <div className="section-header">
              <h2>🚚 My Deliveries</h2>
              <div className="header-actions">
                <button className="refresh-btn" onClick={fetchDashboardData}>
                  🔄 Refresh
                </button>
              </div>
            </div>
            
            {myDeliveries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🚚</div>
                <h3>No deliveries yet!</h3>
                <p>Your accepted and completed deliveries will appear here.</p>
              </div>
            ) : (
              <div className="deliveries-grid">
                {myDeliveries.map((delivery) => (
                  <div key={delivery._id} className="delivery-card">
                    <div className="delivery-header">
                      <div className="delivery-info">
                        <h3>Order #{delivery.orderNumber}</h3>
                        <p className="delivery-time">{formatDate(delivery.createdAt)}</p>
                      </div>
                      <div className="delivery-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(delivery.status) }}
                        >
                          {delivery.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="delivery-details">
                      <div className="restaurant-info">
                        <h4>🏪 {delivery.restaurant?.name}</h4>
                        <p>{delivery.restaurant?.address}</p>
                      </div>
                      
                      <div className="customer-info">
                        <h4>👤 Customer</h4>
                        <p>{delivery.deliveryAddress?.name}</p>
                        <p>{delivery.deliveryAddress?.street}, {delivery.deliveryAddress?.city}</p>
                        <p>📱 {delivery.deliveryAddress?.phone}</p>
                      </div>
                      
                      <div className="delivery-earnings">
                        <span className="earnings-amount">₹{delivery.deliveryFee || 40}</span>
                        <span className="earnings-label">Delivery Fee</span>
                      </div>
                    </div>
                    
                    <div className="delivery-actions">
                      {delivery.status === 'ready_for_pickup' && (
                        <button 
                          className="action-btn pickup"
                          onClick={() => updateDeliveryStatus(delivery._id, 'picked_up')}
                        >
                          📦 Mark as Picked Up
                        </button>
                      )}
                      
                      {delivery.status === 'picked_up' && (
                        <button 
                          className="action-btn delivering"
                          onClick={() => updateDeliveryStatus(delivery._id, 'out_for_delivery')}
                        >
                          🚚 Out for Delivery
                        </button>
                      )}
                      
                      {delivery.status === 'out_for_delivery' && (
                        <button 
                          className="action-btn delivered"
                          onClick={() => updateDeliveryStatus(delivery._id, 'delivered')}
                        >
                          ✅ Mark as Delivered
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

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="dashboard-content">
          <div className="earnings-section">
            <div className="section-header">
              <h2>💰 Earnings</h2>
              <div className="header-actions">
                <button className="refresh-btn" onClick={fetchDashboardData}>
                  🔄 Refresh
                </button>
              </div>
            </div>
            
            <div className="earnings-summary">
              <div className="earnings-card">
                <h3>Today's Earnings</h3>
                <p className="earnings-amount">₹{dashboardStats.todayEarnings}</p>
                <span className="earnings-deliveries">{dashboardStats.todayDeliveries} deliveries</span>
              </div>
              
              <div className="earnings-card">
                <h3>This Week</h3>
                <p className="earnings-amount">₹{dashboardStats.totalEarnings}</p>
                <span className="earnings-deliveries">{dashboardStats.totalDeliveries} deliveries</span>
              </div>
              
              <div className="earnings-card">
                <h3>Average per Delivery</h3>
                <p className="earnings-amount">₹{dashboardStats.totalDeliveries > 0 ? (dashboardStats.totalEarnings / dashboardStats.totalDeliveries).toFixed(0) : 0}</p>
                <span className="earnings-deliveries">Per order</span>
              </div>
            </div>
            
            {earnings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💰</div>
                <h3>No earnings yet!</h3>
                <p>Start accepting deliveries to see your earnings here.</p>
              </div>
            ) : (
              <div className="earnings-history">
                <h3>Recent Earnings</h3>
                <div className="earnings-list">
                  {earnings.map((earning) => (
                    <div key={earning._id} className="earning-item">
                      <div className="earning-info">
                        <h4>Order #{earning.orderNumber}</h4>
                        <p>{formatDate(earning.date)}</p>
                      </div>
                      <div className="earning-amount">
                        +₹{earning.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartnerDashboard;

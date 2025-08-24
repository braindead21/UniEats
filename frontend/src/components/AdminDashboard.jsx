import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

// Admin Dashboard Component
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time refresh every 45 seconds for admin dashboard
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 45000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, usersRes, ordersRes, restaurantsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/orders'),
        api.get('/admin/restaurants')
      ]);

      setDashboardData(dashboardRes.data);
      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
      setRestaurants(restaurantsRes.data || []);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive });
      await fetchDashboardData(); // Refresh data
      alert(`User ${isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const updateRestaurantStatus = async (restaurantId, isActive) => {
    try {
      await api.put(`/admin/restaurants/${restaurantId}/status`, { isActive });
      await fetchDashboardData(); // Refresh data
      alert(`Restaurant ${isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating restaurant status:', error);
      alert('Failed to update restaurant status');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <h2>Loading Admin Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>Complete platform control and oversight</p>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders ({orders.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          🏪 Restaurants ({restaurants.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="admin-overview">
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-header">
                <h3>👨‍🎓 Students</h3>
                <span className="stat-number">{dashboardData.stats.users.students}</span>
              </div>
              <p>Active student accounts</p>
            </div>
            
            <div className="admin-stat-card">
              <div className="stat-header">
                <h3>🏪 Restaurant Owners</h3>
                <span className="stat-number">{dashboardData.stats.users.restaurantOwners}</span>
              </div>
              <p>Restaurant partners</p>
            </div>
            
            <div className="admin-stat-card">
              <div className="stat-header">
                <h3>🏍️ Delivery Partners</h3>
                <span className="stat-number">{dashboardData.stats.users.deliveryPartners}</span>
              </div>
              <p>Available: {dashboardData.stats.activeDeliveryPartners}</p>
            </div>
            
            <div className="admin-stat-card">
              <div className="stat-header">
                <h3>📦 Total Orders</h3>
                <span className="stat-number">{dashboardData.stats.orders.total}</span>
              </div>
              <p>Pending: {dashboardData.stats.orders.pending}</p>
            </div>
            
            <div className="admin-stat-card">
              <div className="stat-header">
                <h3>💰 Today's Revenue</h3>
                <span className="stat-number">₹{dashboardData.stats.revenue.today}</span>
              </div>
              <p>Orders today: {dashboardData.stats.orders.today}</p>
            </div>
            
            <div className="admin-stat-card">
              <div className="stat-header">
                <h3>🍽️ Restaurants</h3>
                <span className="stat-number">{dashboardData.stats.restaurants}</span>
              </div>
              <p>Active partners</p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="admin-recent-activities">
            <div className="recent-section">
              <h3>🕒 Recent Orders</h3>
              <div className="recent-list">
                {dashboardData.recentActivities.orders.map(order => (
                  <div key={order._id} className="recent-item">
                    <div className="recent-info">
                      <strong>Order #{order.orderNumber}</strong>
                      <p>{order.restaurant?.name} • {order.user?.name}</p>
                    </div>
                    <div className="recent-meta">
                      <span className={`status-badge ${order.status}`}>{order.status}</span>
                      <span className="recent-time">₹{order.pricing?.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="recent-section">
              <h3>👤 New Users</h3>
              <div className="recent-list">
                {dashboardData.recentActivities.users.map(user => (
                  <div key={user._id} className="recent-item">
                    <div className="recent-info">
                      <strong>{user.name}</strong>
                      <p>{user.email}</p>
                    </div>
                    <div className="recent-meta">
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-users">
          <div className="admin-section-header">
            <h2>👥 User Management</h2>
            <div className="admin-actions">
              <button className="admin-btn primary" onClick={fetchDashboardData}>
                🔄 Refresh
              </button>
            </div>
          </div>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <strong>{user.name}</strong>
                        {user.phone && <small>{user.phone}</small>}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-indicator ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className={`admin-btn ${user.isActive ? 'danger' : 'success'}`}
                          onClick={() => updateUserStatus(user._id, !user.isActive)}
                        >
                          {user.isActive ? '🚫 Deactivate' : '✅ Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="admin-orders">
          <div className="admin-section-header">
            <h2>📦 Order Management</h2>
            <div className="admin-actions">
              <button className="admin-btn primary" onClick={fetchDashboardData}>
                🔄 Refresh
              </button>
            </div>
          </div>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <strong>#{order.orderNumber}</strong>
                    </td>
                    <td>
                      <div className="user-info">
                        <strong>{order.user?.name}</strong>
                        <small>{order.user?.email}</small>
                      </div>
                    </td>
                    <td>{order.restaurant?.name}</td>
                    <td>
                      <div className="order-items-preview">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="item-preview">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <small>+{order.items.length - 2} more</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>₹{order.pricing?.total}</strong>
                    </td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <div className="admin-restaurants">
          <div className="admin-section-header">
            <h2>🏪 Restaurant Management</h2>
            <div className="admin-actions">
              <button className="admin-btn primary" onClick={fetchDashboardData}>
                🔄 Refresh
              </button>
            </div>
          </div>
          
          <div className="restaurant-grid">
            {restaurants.map(restaurant => (
              <div key={restaurant._id} className="restaurant-admin-card">
                <div className="restaurant-header">
                  <img 
                    src={restaurant.image || '/placeholder-restaurant.jpg'} 
                    alt={restaurant.name}
                    className="restaurant-admin-img"
                  />
                  <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                    <div className="restaurant-meta">
                      <span>⭐ {restaurant.rating}</span>
                      <span>📍 {restaurant.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="restaurant-stats">
                  <div className="stat">
                    <span>📞 {restaurant.phone}</span>
                  </div>
                  <div className="stat">
                    <span>📧 {restaurant.email}</span>
                  </div>
                </div>
                
                <div className="restaurant-admin-actions">
                  <span className={`status-indicator ${restaurant.isActive ? 'active' : 'inactive'}`}>
                    {restaurant.isActive ? '✅ Active' : '❌ Inactive'}
                  </span>
                  <button
                    className={`admin-btn ${restaurant.isActive ? 'danger' : 'success'}`}
                    onClick={() => updateRestaurantStatus(restaurant._id, !restaurant.isActive)}
                  >
                    {restaurant.isActive ? '🚫 Deactivate' : '✅ Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

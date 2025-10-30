import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './NotificationCenter.css';
import { 
  FiBell, FiCheck, FiX, FiPackage, FiTruck, FiCheckCircle, 
  FiAlertCircle, FiTag, FiInfo, FiStar, FiGift 
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

/**
 * NotificationCenter Component
 * Displays user notifications with filtering, marking as read, and deletion
 * ✅ OPTIMIZED with React.memo, useMemo, useCallback
 */
const NotificationCenter = React.memo(() => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, orders, promos, updates
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  // Load notifications from localStorage on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Update unread count
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Load notifications from localStorage or use demo data
  const loadNotifications = useCallback(() => {
    const saved = localStorage.getItem('unieats_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        setNotifications(getDemoNotifications());
      }
    } else {
      setNotifications(getDemoNotifications());
    }
  }, []);

  // Save notifications to localStorage - stable callback
  const saveNotifications = useCallback((notifs) => {
    setNotifications(notifs);
    localStorage.setItem('unieats_notifications', JSON.stringify(notifs));
  }, []);

  // Demo notifications - memoized
  const getDemoNotifications = useCallback(() => [
    {
      id: 1,
      type: 'order',
      title: 'Order Delivered! 🎉',
      message: 'Your order #ORD-1234 has been delivered successfully.',
      time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
      read: false,
      icon: FiCheckCircle,
      color: '#10b981',
      action: { label: 'Rate Order', link: '/orders/1234' }
    },
    {
      id: 2,
      type: 'order',
      title: 'Order Out for Delivery 🚚',
      message: 'Your order is on the way! Expected delivery in 15 minutes.',
      time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
      read: false,
      icon: FiTruck,
      color: '#3b82f6',
      action: { label: 'Track Order', link: '/orders/1233/track' }
    },
    {
      id: 3,
      type: 'promo',
      title: '50% OFF on Your Next Order! 🎊',
      message: 'Use code MEGA50 and get flat 50% discount up to ₹200.',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: false,
      icon: FiTag,
      color: '#8b5cf6',
      action: { label: 'Order Now', link: '/restaurants' }
    },
    {
      id: 4,
      type: 'order',
      title: 'Order Confirmed ✓',
      message: 'Your order #ORD-1232 has been confirmed by the restaurant.',
      time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      read: true,
      icon: FiCheckCircle,
      color: '#10b981',
      action: { label: 'View Order', link: '/orders/1232' }
    },
    {
      id: 5,
      type: 'update',
      title: 'New Feature: Save Addresses! 📍',
      message: 'You can now save multiple delivery addresses for faster checkout.',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true,
      icon: FiInfo,
      color: '#06b6d4',
      action: { label: 'Try Now', link: '/dashboard?tab=addresses' }
    },
    {
      id: 6,
      type: 'promo',
      title: 'Weekend Special Offers! 🎉',
      message: '20% OFF on all orders this weekend. Don\'t miss out!',
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      read: true,
      icon: FiGift,
      color: '#f59e0b',
      action: { label: 'Browse Menu', link: '/restaurants' }
    }
  ], []);

  // Format time ago - memoized calculation
  const getTimeAgo = useCallback((isoString) => {
    const now = new Date();
    const time = new Date(isoString);
    const diffInMs = now - time;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return time.toLocaleDateString();
  }, []);

  // Mark notification as read - stable callback
  const markAsRead = useCallback((notificationId) => {
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  }, [notifications, saveNotifications]);

  // Mark all as read - stable callback
  const markAllAsRead = useCallback(() => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  }, [notifications, saveNotifications]);

  // Delete notification - stable callback
  const deleteNotification = useCallback((notificationId) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    saveNotifications(updated);
  }, [notifications, saveNotifications]);

  // Clear all notifications - stable callback
  const clearAll = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  // Filter notifications - memoized
  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  }, [filter, notifications]);

  // Get icon component - stable callback
  const getNotificationIcon = useCallback((notification) => {
    const Icon = notification.icon;
    return <Icon style={{ color: notification.color }} />;
  }, []);

  return (
    <div className="notification-center" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        className={`notification-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="notification-dropdown">
          
          {/* Header */}
          <div className="notification-dropdown-header">
            <div className="notification-header-left">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <span className="unread-indicator">{unreadCount} new</span>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="notification-header-actions">
                {unreadCount > 0 && (
                  <button
                    className="mark-all-read-btn"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                  >
                    <FiCheck /> Mark all read
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="notification-filters">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
              {filter === 'all' && notifications.length > 0 && (
                <span className="filter-count">({notifications.length})</span>
              )}
            </button>
            <button
              className={`filter-tab ${filter === 'order' ? 'active' : ''}`}
              onClick={() => setFilter('order')}
            >
              <FiPackage /> Orders
            </button>
            <button
              className={`filter-tab ${filter === 'promo' ? 'active' : ''}`}
              onClick={() => setFilter('promo')}
            >
              <FiTag /> Promos
            </button>
            <button
              className={`filter-tab ${filter === 'update' ? 'active' : ''}`}
              onClick={() => setFilter('update')}
            >
              <FiInfo /> Updates
            </button>
          </div>

          {/* Notifications List */}
          <div className="notification-list">
            {filteredNotifications.length === 0 ? (
              <div className="notification-empty-state">
                <FiBell className="empty-icon" />
                <p className="empty-title">No notifications</p>
                <p className="empty-subtitle">
                  {filter === 'all' 
                    ? "You're all caught up!"
                    : `No ${filter} notifications`}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  {/* Icon */}
                  <div className="notification-icon">
                    {getNotificationIcon(notification)}
                  </div>

                  {/* Content */}
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{getTimeAgo(notification.time)}</div>

                    {/* Action Button */}
                    {notification.action && (
                      <button className="notification-action-btn">
                        {notification.action.label} →
                      </button>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    className="notification-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    title="Remove notification"
                  >
                    <FiX />
                  </button>

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="notification-unread-dot"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="notification-dropdown-footer">
              <button className="clear-all-btn" onClick={clearAll}>
                Clear All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

NotificationCenter.displayName = 'NotificationCenter';

export default NotificationCenter;

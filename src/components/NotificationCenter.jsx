import React, { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../contexts/NotificationContext';
import '../CSS/NotificationCenter.css';

const NotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    isNotificationCenterOpen,
    notificationPreferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    closeNotificationCenter
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);

  // Close notification center when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationCenterOpen && !event.target.closest('.notification-center')) {
        closeNotificationCenter();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationCenterOpen, closeNotificationCenter]);

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'booking':
        return notifications.filter(n => n.category === 'booking');
      case 'payment':
        return notifications.filter(n => n.category === 'payment');
      case 'system':
        return notifications.filter(n => n.category === 'system');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type, category) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        switch (category) {
          case 'booking':
            return '🚗';
          case 'payment':
            return '💰';
          case 'system':
            return '⚙️';
          default:
            return '📢';
        }
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#2e7d32';
      case 'error':
        return '#d32f2f';
      case 'warning':
        return '#f57c00';
      default:
        return '#1976d2';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handlePreferenceChange = (key, value) => {
    updatePreferences({ [key]: value });
  };

  if (!isNotificationCenterOpen) return null;

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notification-overlay">
      <div className="notification-center">
        {/* Header */}
        <div className="notification-header">
          <div className="notification-title">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <div className="notification-actions">
            <button
              className="action-btn"
              onClick={() => setShowPreferences(!showPreferences)}
              title="Settings"
            >
              ⚙️
            </button>
            <button
              className="action-btn"
              onClick={markAllAsRead}
              title="Mark all as read"
              disabled={unreadCount === 0}
            >
              ✓
            </button>
            <button
              className="action-btn"
              onClick={clearAllNotifications}
              title="Clear all"
              disabled={notifications.length === 0}
            >
              🗑️
            </button>
            <button
              className="action-btn close-btn"
              onClick={closeNotificationCenter}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Preferences Panel */}
        {showPreferences && (
          <div className="notification-preferences">
            <h4>Notification Settings</h4>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={notificationPreferences.browser}
                  onChange={(e) => handlePreferenceChange('browser', e.target.checked)}
                />
                Browser Notifications
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={notificationPreferences.inApp}
                  onChange={(e) => handlePreferenceChange('inApp', e.target.checked)}
                />
                In-App Notifications
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={notificationPreferences.email}
                  onChange={(e) => handlePreferenceChange('email', e.target.checked)}
                />
                Email Notifications
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={notificationPreferences.sound}
                  onChange={(e) => handlePreferenceChange('sound', e.target.checked)}
                />
                Sound Notifications
              </label>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="notification-filters">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'booking' ? 'active' : ''}`}
            onClick={() => setActiveFilter('booking')}
          >
            Booking ({notifications.filter(n => n.category === 'booking').length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveFilter('payment')}
          >
            Payment ({notifications.filter(n => n.category === 'payment').length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'system' ? 'active' : ''}`}
            onClick={() => setActiveFilter('system')}
          >
            System ({notifications.filter(n => n.category === 'system').length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <p>No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  <span style={{ color: getNotificationColor(notification.type) }}>
                    {getNotificationIcon(notification.type, notification.category)}
                  </span>
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h4>{notification.title}</h4>
                    <span className="notification-time">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-meta">
                    <span className={`notification-category ${notification.category}`}>
                      {notification.category}
                    </span>
                    <span className={`notification-type ${notification.type}`}>
                      {notification.type}
                    </span>
                  </div>
                </div>
                <div className="notification-actions">
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 
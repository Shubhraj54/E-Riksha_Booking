import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationBell = () => {
  const { unreadCount, toggleNotificationCenter } = useNotifications();

  return (
    <div 
      className={`notification-bell ${unreadCount > 0 ? 'has-notifications' : ''}`}
      onClick={toggleNotificationCenter}
      title="Notifications"
    >
      <span className="notification-bell-icon">🔔</span>
      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </div>
  );
};

export default NotificationBell; 
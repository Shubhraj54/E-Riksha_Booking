import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../utils/sessionManager';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    browser: true,
    inApp: true,
    email: false,
    sound: true
  });

  // Load notifications from localStorage
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const savedNotifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
      setNotifications(savedNotifications);
      setUnreadCount(savedNotifications.filter(n => !n.read).length);
    }

    // Load notification preferences
    const savedPreferences = JSON.parse(localStorage.getItem('notificationPreferences') || '{}');
    setNotificationPreferences(prev => ({ ...prev, ...savedPreferences }));
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && notificationPreferences.browser) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [notificationPreferences.browser]);

  // Save notifications to localStorage
  const saveNotifications = useCallback((newNotifications) => {
    const user = getCurrentUser();
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(newNotifications));
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences) => {
    localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
  }, []);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const user = getCurrentUser();
    if (!user) return;

    const newNotification = {
      id: Date.now().toString(),
      userId: user.id,
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info', // 'info', 'success', 'warning', 'error'
      category: notification.category || 'general', // 'booking', 'payment', 'system', 'general'
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: notification.actionUrl,
      data: notification.data || {}
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    saveNotifications(updatedNotifications);

    // Show browser notification
    if (notificationPreferences.browser && Notification.permission === 'granted') {
      const browserNotification = new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: newNotification.id,
        requireInteraction: newNotification.type === 'error',
        silent: !notificationPreferences.sound
      });

      // Handle notification click
      browserNotification.onclick = () => {
        window.focus();
        if (newNotification.actionUrl) {
          window.location.href = newNotification.actionUrl;
        }
        markAsRead(newNotification.id);
      };
    }

    // Show toast notification
    if (notificationPreferences.inApp) {
      const toastOptions = {
        duration: newNotification.type === 'error' ? 6000 : 4000,
        position: 'top-right',
      };

      switch (newNotification.type) {
        case 'success':
          toast.success(newNotification.message, toastOptions);
          break;
        case 'error':
          toast.error(newNotification.message, toastOptions);
          break;
        case 'warning':
          toast(newNotification.message, {
            ...toastOptions,
            icon: '⚠️',
            style: {
              background: '#f57c00',
              color: '#fff',
            },
          });
          break;
        default:
          toast(newNotification.message, toastOptions);
      }
    }

    return newNotification;
  }, [notifications, notificationPreferences, saveNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Delete notification
  const deleteNotification = useCallback((notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    setUnreadCount(prev => notification && !notification.read ? prev - 1 : prev);
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    saveNotifications([]);
  }, [saveNotifications]);

  // Update notification preferences
  const updatePreferences = useCallback((newPreferences) => {
    const updatedPreferences = { ...notificationPreferences, ...newPreferences };
    setNotificationPreferences(updatedPreferences);
    savePreferences(updatedPreferences);
  }, [notificationPreferences, savePreferences]);

  // Get notifications by category
  const getNotificationsByCategory = useCallback((category) => {
    return notifications.filter(notification => notification.category === category);
  }, [notifications]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  // Toggle notification center
  const toggleNotificationCenter = useCallback(() => {
    setIsNotificationCenterOpen(prev => !prev);
  }, []);

  // Close notification center
  const closeNotificationCenter = useCallback(() => {
    setIsNotificationCenterOpen(false);
  }, []);

  // Simulate real-time notifications (for demo purposes)
  const simulateBookingNotification = useCallback(() => {
    addNotification({
      title: 'Booking Confirmed!',
      message: 'Your rickshaw booking has been confirmed. Driver will arrive in 10 minutes.',
      type: 'success',
      category: 'booking',
      actionUrl: '/profile'
    });
  }, [addNotification]);

  const simulatePaymentNotification = useCallback(() => {
    addNotification({
      title: 'Payment Successful',
      message: 'Payment of ₹150 has been processed successfully.',
      type: 'success',
      category: 'payment',
      actionUrl: '/profile'
    });
  }, [addNotification]);

  const simulateSystemNotification = useCallback(() => {
    addNotification({
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2-4 AM.',
      type: 'warning',
      category: 'system'
    });
  }, [addNotification]);

  const value = {
    notifications,
    unreadCount,
    isNotificationCenterOpen,
    notificationPreferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    getNotificationsByCategory,
    getUnreadNotifications,
    toggleNotificationCenter,
    closeNotificationCenter,
    simulateBookingNotification,
    simulatePaymentNotification,
    simulateSystemNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 
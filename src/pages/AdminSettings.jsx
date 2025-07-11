import React, { useState, useEffect } from 'react';
import { FaCog, FaShieldAlt, FaBell, FaPalette, FaDatabase, FaSave, FaUndo } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../CSS/AdminSettings.css';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'E-Riksha Rental Services',
      siteDescription: 'Professional auto-rickshaw rental services',
      contactEmail: 'admin@eriksha.com',
      contactPhone: '+91 9876543210',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      language: 'en'
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      requireTwoFactor: false,
      passwordMinLength: 8,
      enableAuditLog: true,
      ipWhitelist: '',
      autoLogout: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingAlerts: true,
      paymentAlerts: true,
      systemAlerts: true,
      dailyReports: false,
      weeklyReports: true
    },
    appearance: {
      theme: 'light',
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      sidebarCollapsed: false,
      showAnimations: true,
      compactMode: false
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetention: 365,
      maxFileSize: 10,
      enableCaching: true
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load from localStorage if available
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      loadSettings();
      toast.success('Settings reset to default');
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FaCog /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'appearance', label: 'Appearance', icon: <FaPalette /> },
    { id: 'system', label: 'System', icon: <FaDatabase /> }
  ];

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>Site Configuration</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label>Site Name</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
            placeholder="Enter site name"
          />
        </div>
        <div className="setting-item">
          <label>Site Description</label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
            placeholder="Enter site description"
            rows="3"
          />
        </div>
        <div className="setting-item">
          <label>Contact Email</label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
            placeholder="admin@example.com"
          />
        </div>
        <div className="setting-item">
          <label>Contact Phone</label>
          <input
            type="tel"
            value={settings.general.contactPhone}
            onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
            placeholder="+91 9876543210"
          />
        </div>
        <div className="setting-item">
          <label>Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Currency</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>Security Configuration</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label>Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="480"
          />
        </div>
        <div className="setting-item">
          <label>Max Login Attempts</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            min="3"
            max="10"
          />
        </div>
        <div className="setting-item">
          <label>Password Minimum Length</label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
            min="6"
            max="20"
          />
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.security.requireTwoFactor}
              onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
            />
            Require Two-Factor Authentication
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.security.enableAuditLog}
              onChange={(e) => handleSettingChange('security', 'enableAuditLog', e.target.checked)}
            />
            Enable Audit Logging
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.security.autoLogout}
              onChange={(e) => handleSettingChange('security', 'autoLogout', e.target.checked)}
            />
            Auto Logout on Inactivity
          </label>
        </div>
        <div className="setting-item">
          <label>IP Whitelist (comma-separated)</label>
          <textarea
            value={settings.security.ipWhitelist}
            onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
            placeholder="192.168.1.1, 10.0.0.1"
            rows="3"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      <div className="settings-grid">
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            />
            Email Notifications
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
            />
            SMS Notifications
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
            />
            Push Notifications
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.bookingAlerts}
              onChange={(e) => handleSettingChange('notifications', 'bookingAlerts', e.target.checked)}
            />
            Booking Alerts
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.paymentAlerts}
              onChange={(e) => handleSettingChange('notifications', 'paymentAlerts', e.target.checked)}
            />
            Payment Alerts
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.systemAlerts}
              onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
            />
            System Alerts
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.dailyReports}
              onChange={(e) => handleSettingChange('notifications', 'dailyReports', e.target.checked)}
            />
            Daily Reports
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.weeklyReports}
              onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
            />
            Weekly Reports
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <h3>Appearance & UI</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label>Theme</label>
          <select
            value={settings.appearance.theme}
            onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Primary Color</label>
          <input
            type="color"
            value={settings.appearance.primaryColor}
            onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
          />
        </div>
        <div className="setting-item">
          <label>Secondary Color</label>
          <input
            type="color"
            value={settings.appearance.secondaryColor}
            onChange={(e) => handleSettingChange('appearance', 'secondaryColor', e.target.value)}
          />
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.appearance.sidebarCollapsed}
              onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
            />
            Collapsed Sidebar by Default
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.appearance.showAnimations}
              onChange={(e) => handleSettingChange('appearance', 'showAnimations', e.target.checked)}
            />
            Show Animations
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.appearance.compactMode}
              onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
            />
            Compact Mode
          </label>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="settings-section">
      <h3>System Configuration</h3>
      <div className="settings-grid">
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.system.maintenanceMode}
              onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
            />
            Maintenance Mode
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.system.debugMode}
              onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
            />
            Debug Mode
          </label>
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.system.autoBackup}
              onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
            />
            Auto Backup
          </label>
        </div>
        <div className="setting-item">
          <label>Backup Frequency</label>
          <select
            value={settings.system.backupFrequency}
            onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Data Retention (days)</label>
          <input
            type="number"
            value={settings.system.dataRetention}
            onChange={(e) => handleSettingChange('system', 'dataRetention', parseInt(e.target.value))}
            min="30"
            max="3650"
          />
        </div>
        <div className="setting-item">
          <label>Max File Size (MB)</label>
          <input
            type="number"
            value={settings.system.maxFileSize}
            onChange={(e) => handleSettingChange('system', 'maxFileSize', parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </div>
        <div className="setting-item checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={settings.system.enableCaching}
              onChange={(e) => handleSettingChange('system', 'enableCaching', e.target.checked)}
            />
            Enable Caching
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>Admin Settings</h1>
        <p>Configure system settings and preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-content">
          {loading ? (
            <div className="settings-loading">
              <div className="loading-spinner"></div>
              <p>Loading settings...</p>
            </div>
          ) : (
            <>
              {renderTabContent()}
              
              <div className="settings-actions">
                <button
                  className="btn btn-secondary"
                  onClick={resetSettings}
                  disabled={loading}
                >
                  <FaUndo /> Reset to Default
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveSettings}
                  disabled={loading}
                >
                  <FaSave /> {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 
import React, { useEffect, useState } from 'react';
import { AdminApi } from '../../../Api/admin';
import './Settings.scss';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    notificationEmail: '',
    maintenanceMode: false,
    maxUploadSize: 5,
    allowedFileTypes: 'jpg,jpeg,png,gif'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AdminApi.getSystemSettings();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AdminApi.updateSystemSettings(settings);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update settings');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>System Settings</h2>
        <p>Configure system preferences and options</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-grid">
          <div className="settings-group">
            <h3>Appearance</h3>
            <div className="setting-item">
              <label>Theme</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleSettingChange}
                className="setting-input"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          <div className="settings-group">
            <h3>General</h3>
            <div className="setting-item">
              <label>Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleSettingChange}
                className="setting-input"
              >
                <option value="en">English</option>
                <option value="vi">Vietnamese</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Timezone</label>
              <input
                type="text"
                name="timezone"
                value={settings.timezone}
                onChange={handleSettingChange}
                className="setting-input"
              />
            </div>
            <div className="setting-item">
              <label>Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleSettingChange}
                className="setting-input"
              >
                <option value="USD">USD</option>
                <option value="VND">VND</option>
              </select>
            </div>
          </div>

          <div className="settings-group">
            <h3>Upload Settings</h3>
            <div className="setting-item">
              <label>Max Upload Size (MB)</label>
              <input
                type="number"
                name="maxUploadSize"
                value={settings.maxUploadSize}
                onChange={handleSettingChange}
                className="setting-input"
              />
            </div>
            <div className="setting-item">
              <label>Allowed File Types</label>
              <input
                type="text"
                name="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={handleSettingChange}
                className="setting-input"
              />
            </div>
          </div>

          <div className="settings-group">
            <h3>Maintenance</h3>
            <div className="setting-item">
              <label>Maintenance Mode</label>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleSettingChange}
                className="setting-checkbox"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="save-button">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;

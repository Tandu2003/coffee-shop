import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../Components/Breadcrumb';
import AuthContext from '../../Context/AuthProvider';
import { Auth } from '../../Api/auth';
import './Account.scss';

const Account = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: auth.user?.username || '',
    email: auth.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Account | OKBF';
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // TODO: Implement profile update API
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement password change API
      setMessage('Password changed successfully');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await Auth.logout();
      setAuth({ loggedIn: false });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <main className="account-page">
      <section>
        <Breadcrumb breadcrumb="My Account" />
      </section>
      <section>
        <div className="container">
          <div className="account-wrapper">
            <div className="account-sidebar">
              <div className="user-info">
                <h3>{auth.user?.username}</h3>
                <p>{auth.user?.email}</p>
              </div>
              <nav className="account-nav">
                <button
                  className={activeTab === 'profile' ? 'active' : ''}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile Information
                </button>
                <button
                  className={activeTab === 'orders' ? 'active' : ''}
                  onClick={() => setActiveTab('orders')}
                >
                  Order History
                </button>
                <button
                  className={activeTab === 'password' ? 'active' : ''}
                  onClick={() => setActiveTab('password')}
                >
                  Change Password
                </button>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </nav>
            </div>

            <div className="account-content">
              {message && (
                <div
                  className={`message ${message.includes('success') ? 'success' : 'error'}`}
                >
                  {message}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="profile-section">
                  <h2>Profile Information</h2>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <button
                      type="submit"
                      className="theme-btn__black"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="orders-section">
                  <h2>Order History</h2>
                  <div className="orders-list">
                    {/* TODO: Implement order history */}
                    <p>No orders found</p>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="password-section">
                  <h2>Change Password</h2>
                  <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="theme-btn__black"
                      disabled={loading}
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Account;

import React, { useState } from 'react';
import { useProducts } from '../../Context/ProductProvider';
import './ProductUpdateNotification.scss';

const ProductUpdateNotification = () => {
  const { refreshProducts, lastUpdated, productCount } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'chưa cập nhật';
    
    const now = new Date();
    const diff = now - new Date(lastUpdated);
    
    // Nếu cập nhật trong vòng 1 phút
    if (diff < 60000) {
      return 'vừa cập nhật';
    }
    
    // Nếu cập nhật trong vòng 1 giờ
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} phút trước`;
    }
    
    // Nếu cập nhật trong vòng 24 giờ
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} giờ trước`;
    }
    
    // Nếu cập nhật cách đây hơn 1 ngày
    const days = Math.floor(diff / 86400000);
    return `${days} ngày trước`;
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    setMessage('');
    
    // Gọi API cập nhật sản phẩm với thông báo
    refreshProducts(true);
    
    // Simulate some time for API request
    setTimeout(() => {
      setRefreshing(false);
      setMessage('Dữ liệu sản phẩm đã được cập nhật thành công cho AI Chatbot!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }, 1500);
  };

  return (
    <div className="product-update-notification">
      <div className="notification-header">
        <h4>Trạng thái dữ liệu AI Chatbot</h4>
      </div>
      <div className="last-updated">
        Cập nhật lần cuối: {formatLastUpdated()}
      </div>
      <div className="notification-content">
        Hiện có {productCount || 0} sản phẩm trong cơ sở dữ liệu. AI Chatbot sẽ sử dụng dữ liệu này để đề xuất sản phẩm cho khách hàng.
      </div>
      <div className="notification-actions">
        <button 
          className="refresh-button" 
          onClick={handleManualRefresh} 
          disabled={refreshing}
        >
          {refreshing ? 'Đang cập nhật...' : 'Cập nhật dữ liệu cho AI'}
        </button>
      </div>
      
      {refreshing && (
        <div className="notification-status loading">
          <div className="loading-spinner"></div>
          Đang cập nhật dữ liệu sản phẩm...
        </div>
      )}
      
      {message && !refreshing && (
        <div className="notification-status success">
          <i>✓</i> {message}
        </div>
      )}
    </div>
  );
};

export default ProductUpdateNotification;

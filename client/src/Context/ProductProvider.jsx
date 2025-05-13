import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { ProductApi } from '../Api/product';
import './ProductProvider.css';

const ProductContext = createContext({});

// Tạo một đối tượng để lưu trữ sản phẩm trong localStorage
const STORAGE_KEY = 'coffee_shop_products';
const LAST_UPDATED_KEY = 'coffee_shop_products_last_updated';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newProductsAvailable, setNewProductsAvailable] = useState(false);
  const [productCount, setProductCount] = useState(0);

  // Tối ưu hóa fetchProducts bằng useCallback để có thể sử dụng trong useEffect
  const fetchProducts = useCallback(async (showNotification = false) => {
    setLoading(true);
    try {
      const data = await ProductApi.getAllProducts();
      
      // Lưu số lượng sản phẩm cũ để so sánh
      const oldProductCount = products.length;
      
      setProducts(data);
      setProductCount(data.length);
      const now = new Date();
      setLastUpdated(now);
      
      // Lưu vào localStorage để sử dụng khi không có kết nối hoặc tối ưu tốc độ
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(LAST_UPDATED_KEY, now.toISOString());
      
      // Thông báo nếu có sản phẩm mới và được yêu cầu thông báo
      if (showNotification && data.length > oldProductCount) {
        setNewProductsAvailable(true);
        // Tự động ẩn thông báo sau 5 giây
        setTimeout(() => setNewProductsAvailable(false), 5000);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error);
      setLoading(false);
      
      // Nếu lấy dữ liệu từ API thất bại, thử lấy từ localStorage
      const cachedProducts = localStorage.getItem(STORAGE_KEY);
      const cachedLastUpdated = localStorage.getItem(LAST_UPDATED_KEY);
      
      if (cachedProducts) {
        try {
          const parsedProducts = JSON.parse(cachedProducts);
          setProducts(parsedProducts);
          setProductCount(parsedProducts.length);
          if (cachedLastUpdated) {
            setLastUpdated(new Date(cachedLastUpdated));
          }
        } catch (parseError) {
          console.error('Error parsing cached products:', parseError);
        }
      }
    }
  }, [products.length]);

  // Tải sản phẩm từ localStorage trước, sau đó cập nhật từ API
  useEffect(() => {
    // Trước tiên, thử lấy từ localStorage để hiển thị nhanh
    const cachedProducts = localStorage.getItem(STORAGE_KEY);
    const cachedLastUpdated = localStorage.getItem(LAST_UPDATED_KEY);
    
    if (cachedProducts) {
      try {
        const parsedProducts = JSON.parse(cachedProducts);
        setProducts(parsedProducts);
        setProductCount(parsedProducts.length);
        if (cachedLastUpdated) {
          setLastUpdated(new Date(cachedLastUpdated));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error parsing cached products:', error);
      }
    }
    
    // Sau đó, cập nhật từ API
    fetchProducts();

    // Thiết lập cơ chế tự động cập nhật sau mỗi 5 phút
    const intervalId = setInterval(() => {
      fetchProducts(true); // true = hiện thông báo nếu có sản phẩm mới
    }, 5 * 60 * 1000); // 5 phút = 300,000ms

    return () => clearInterval(intervalId);
  }, [fetchProducts]);

  // Cung cấp một hàm để các component khác có thể gọi để cập nhật sản phẩm
  const refreshProducts = (showNotification = false) => {
    fetchProducts(showNotification);
  };
  // Lọc sản phẩm theo loại (cà phê hoặc merch)
  const getCoffeeProducts = useCallback(() => {
    return products.filter(product => 
      product.productType === 'coffee' || 
      product.category?.toLowerCase().includes('coffee') ||
      product.name?.toLowerCase().includes('cà phê') ||
      product.name?.toLowerCase().includes('coffee')
    );
  }, [products]);
  
  const getMerchProducts = useCallback(() => {
    return products.filter(product => 
      product.productType === 'merch' || 
      product.category?.toLowerCase().includes('merch')
    );
  }, [products]);
  
  // Lọc sản phẩm theo từ khóa
  const searchProducts = useCallback((keyword) => {
    if (!keyword) return products;
    
    const searchTerm = keyword.toLowerCase();
    return products.filter(product => 
      product.name?.toLowerCase().includes(searchTerm) || 
      product.description?.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm)
    );
  }, [products]);

  // Đánh dấu đã đọc thông báo sản phẩm mới
  const dismissNewProductsNotification = () => {
    setNewProductsAvailable(false);
  };

  const value = {
    products,
    loading,
    error,
    lastUpdated,
    refreshProducts,
    newProductsAvailable,
    dismissNewProductsNotification,
    productCount,
    getCoffeeProducts,
    getMerchProducts,
    searchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
      {newProductsAvailable && (
        <div className="new-products-notification">
          Có sản phẩm mới vừa được cập nhật!
          <button onClick={dismissNewProductsNotification}>✕</button>
        </div>
      )}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;

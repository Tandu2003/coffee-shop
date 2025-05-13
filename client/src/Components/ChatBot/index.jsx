import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ChatBot.scss';
import messageIcon from '../../Assets/svg/message-icon.svg';
import { useProducts } from '../../Context/ProductProvider';

// Product images import
import coffeeMedium from '../../Assets/img/coffee-medium.png';
import coffeeDark from '../../Assets/img/coffee-dark.png';
import coffeeMediumDark from '../../Assets/img/coffee-medium-dark.png';
import botAvatar from '../../Assets/img/bot-avatar.png';
import userAvatar from '../../Assets/img/user-avatar.png';

const ChatBot = () => {
  const navigate = useNavigate();
  const { 
    products,
    getCoffeeProducts,
    searchProducts,
    refreshProducts,
    lastUpdated 
  } = useProducts(); // Sử dụng hook để lấy danh sách sản phẩm
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef(null);
  const chatPanelRef = useRef(null);
  const dragControls = useDragControls();

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    } else {
      // Add initial greeting message
      const initialMessage = {
        id: Date.now(),
        text: 'Xin chào! Tôi là trợ lý AI của quán cà phê. Bạn cần tôi giúp gì hôm nay? (Đề xuất sản phẩm, thông tin về đồ uống, hoặc giúp đỡ đặt hàng)',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
    }
  }, []);
  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const toggleChat = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputText.trim()) {
      sendMessage();
    }
  };

  const clearChat = () => {
    const initialMessage = {
      id: Date.now(),
      text: 'Xin chào! Tôi là trợ lý AI của quán cà phê. Bạn cần tôi giúp gì hôm nay? (Đề xuất sản phẩm, thông tin về đồ uống, hoặc giúp đỡ đặt hàng)',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMessage]);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const botResponse = generateResponse(inputText);
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setLoading(false);
    }, 1000);
  };  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Định dạng thời gian cập nhật gần nhất
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
  
  const handleViewProduct = (productId) => {
    // Chuyển hướng đến trang sản phẩm
    navigate(`/collections/coffee-shop/${productId}`);
    // Đóng chat sau khi chuyển hướng
    setIsOpen(false);
  };  // Simple AI response generator
  const generateResponse = (userInput) => {
    const userInputLower = userInput.toLowerCase();
    const botMessage = {
      id: Date.now(),
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    
    // Product recommendations based on keywords
    if (userInputLower.includes('đề xuất') || userInputLower.includes('giới thiệu') || userInputLower.includes('gợi ý')) {
      botMessage.text = 'Đây là một số sản phẩm phổ biến của chúng tôi mà bạn có thể thích:';
      
      // Cập nhật sản phẩm mới nhất khi người dùng yêu cầu đề xuất
      refreshProducts();
      
      // Lấy các sản phẩm cà phê
      const coffeeProducts = getCoffeeProducts();
      
      // Nếu có từ khóa cụ thể, lọc sản phẩm theo từ khóa
      let filteredProducts = [...coffeeProducts];
      const keywords = [
        'đậm', 'nhẹ', 'ngọt', 'đắng', 'chua', 'robusta', 'arabica', 
        'espresso', 'latte', 'cappuccino', 'mocha', 'sữa', 'đen'
      ];
      
      // Tìm từ khóa trong câu hỏi của người dùng và sử dụng searchProducts
      for (const keyword of keywords) {
        if (userInputLower.includes(keyword)) {
          // Tìm kiếm sản phẩm phù hợp với từ khóa cụ thể
          const searchResults = searchProducts(keyword);
          
          // Lọc chỉ giữ lại sản phẩm cà phê
          const coffeesWithKeyword = searchResults.filter(product => 
            product.productType === 'coffee' || 
            product.category?.toLowerCase().includes('coffee') ||
            product.name?.toLowerCase().includes('cà phê') ||
            product.name?.toLowerCase().includes('coffee')
          );
          
          // Nếu tìm thấy kết quả phù hợp, sử dụng chúng
          if (coffeesWithKeyword.length > 0) {
            filteredProducts = coffeesWithKeyword;
            break; // Dừng tìm kiếm sau khi tìm thấy từ khóa phù hợp đầu tiên
          }
        }
      }
      
      // Nếu không tìm thấy sản phẩm phù hợp với từ khóa, sử dụng tất cả sản phẩm
      if (filteredProducts.length === 0) {
        filteredProducts = [...products];
      }
      
      // Lấy tối đa 3 sản phẩm để đề xuất
      const recommendedProducts = filteredProducts
        .slice(0, 3)
        .map((product, index) => ({
          id: index + 1,
          productId: product._id || product.productId,
          name: product.name || 'Sản phẩm cà phê',
          description: product.description || 'Hương vị tuyệt hảo từ những hạt cà phê chọn lọc',
          price: `${product.price?.toLocaleString() || '35.000'}đ`,
          // Sử dụng hình ảnh từ sản phẩm hoặc hình ảnh mặc định nếu không có
          image: product.imageDisplay || product.image || (index % 3 === 0 ? coffeeMediumDark : index % 3 === 1 ? coffeeMedium : coffeeDark),
        }));
      
      botMessage.recommendations = recommendedProducts;
    }
    // Thông tin về sản phẩm mới
    else if (userInputLower.includes('sản phẩm mới') || userInputLower.includes('mới nhập') || 
             userInputLower.includes('cập nhật') || userInputLower.includes('mới ra')) {
      
      // Cập nhật sản phẩm mới nhất
      refreshProducts();
      
      botMessage.text = `Danh sách sản phẩm của chúng tôi được cập nhật ${formatLastUpdated()}. Đây là một số sản phẩm mới nhất:`;
      
      // Lấy 3 sản phẩm mới nhất, giả định sắp xếp theo thời gian
      const coffeeProducts = getCoffeeProducts();
      const sortedProducts = [...coffeeProducts].sort((a, b) => {
        // Sắp xếp theo ngày tạo nếu có, nếu không sắp xếp theo ID (giả sử ID mới nhất là lớn nhất)
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return b._id?.localeCompare(a._id);
      });
      
      const newProducts = sortedProducts.slice(0, 3).map((product, index) => ({
        id: index + 1,
        productId: product._id || product.productId,
        name: product.name || 'Sản phẩm cà phê',
        description: product.description || 'Sản phẩm mới của chúng tôi',
        price: `${product.price?.toLocaleString() || '35.000'}đ`,
        image: product.imageDisplay || product.image || (index % 3 === 0 ? coffeeMediumDark : index % 3 === 1 ? coffeeMedium : coffeeDark),
      }));
      
      botMessage.recommendations = newProducts;
    }
    // Information about coffee with recommendations
    else if (userInputLower.includes('cà phê') || userInputLower.includes('coffee')) {
      // Tạo danh sách đề xuất phụ thuộc vào từ khóa cụ thể
      if (userInputLower.includes('arabica') || userInputLower.includes('robusta') || 
          userInputLower.includes('hương vị') || userInputLower.includes('loại') || 
          userInputLower.includes('ngon') || userInputLower.includes('đặc biệt')) {
            
        botMessage.text = 'Cà phê của chúng tôi được chọn lọc từ những hạt cà phê Arabica và Robusta tốt nhất từ Tây Nguyên. Đây là một số loại cà phê phù hợp với bạn:';
        // Sử dụng phương thức getCoffeeProducts từ context
        const coffeeProducts = getCoffeeProducts();
        
        // Lấy tối đa 3 sản phẩm để đề xuất
        const recommendedProducts = coffeeProducts
          .slice(0, 3)
          .map((product, index) => ({
            id: index + 1,
            productId: product._id || product.productId,
            name: product.name || 'Sản phẩm cà phê',
            description: product.description || 'Hương vị tuyệt hảo từ những hạt cà phê chọn lọc',
            price: `${product.price?.toLocaleString() || '35.000'}đ`,
            image: product.imageDisplay || product.image || (index % 3 === 0 ? coffeeMediumDark : index % 3 === 1 ? coffeeMedium : coffeeDark),
          }));
        
        botMessage.recommendations = recommendedProducts;      } else {
        botMessage.text = 'Cà phê của chúng tôi được chọn lọc từ những hạt cà phê Arabica và Robusta tốt nhất từ Tây Nguyên. Chúng tôi rang mới mỗi ngày để đảm bảo hương vị tuyệt hảo. Bạn có muốn tôi đề xuất một số loại cà phê không?';
      }
    }
    // Information about the shop
    else if (userInputLower.includes('cửa hàng') || userInputLower.includes('quán') || userInputLower.includes('giờ mở cửa')) {
      botMessage.text = 'Quán cà phê chúng tôi mở cửa từ 7:00 sáng đến 10:00 tối mỗi ngày. Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP.HCM. Rất hân hạnh được phục vụ bạn!';
    }
    // Help with ordering
    else if (userInputLower.includes('đặt hàng') || userInputLower.includes('mua')) {
      botMessage.text = 'Để đặt hàng, bạn có thể chọn sản phẩm từ menu trên trang web, thêm vào giỏ hàng và thanh toán. Bạn cũng có thể đặt hàng qua số điện thoại 0123456789. Bạn muốn đặt món nào?';
    }
    // Default response
    else {
      botMessage.text = 'Cảm ơn bạn đã liên hệ! Tôi có thể giúp bạn với thông tin sản phẩm, đề xuất đồ uống, hoặc giúp bạn đặt hàng. Bạn cần tôi giúp gì?';
    }

    return botMessage;
  };
  return (
    <div className={`chat-bot-container ${isOpen ? 'open' : ''} ${isDragging ? 'dragging' : ''}`}>
      {/* Chat button draggable at bottom right */}
      <motion.div
        className={`chat-bot-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        whileTap={{ scale: 0.9 }}
        drag
        dragConstraints={{
          top: -400,
          left: -window.innerWidth + 80,
          right: 20,
          bottom: 20
        }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
      >
        <img src={messageIcon} alt="Chat" className="message-icon" />
      </motion.div>

      {/* Chat panel */}
      {isOpen && (
        <motion.div
          className="chat-bot-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          ref={chatPanelRef}
        >
          {/* Chat header */}
          <div className="chat-header">
            <div className="chat-title">
              <img src={botAvatar} alt="Bot" className="bot-avatar" />
              <h3>Trợ lý Cà phê</h3>
            </div>
            <div className="chat-controls">
              <button className="clear-button" onClick={clearChat}>
                🗑️
              </button>
              <button className="close-button" onClick={toggleChat}>
                ×
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender}-message`}
              >
                <div className="message-avatar">
                  <img
                    src={message.sender === 'bot' ? botAvatar : userAvatar}
                    alt={message.sender}
                  />
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  {message.recommendations && (
                    <div className="product-recommendations">
                      {message.recommendations.map((product) => (                        <div key={product.id} className="recommended-product">
                          {typeof product.image === 'string' && product.image.startsWith('http') ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <img src={product.image} alt={product.name} />
                          )}
                          <div className="product-info">
                            <h4>{product.name}</h4>
                            <p>{product.description}</p>
                            <span className="product-price">{product.price}</span>
                            <button 
                              className="view-product-btn" 
                              onClick={() => handleViewProduct(product.productId)}
                            >
                              Xem sản phẩm
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <img src={botAvatar} alt="bot" />
                </div>
                <div className="message-content">
                  <div className="message-text">Đang nhập...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="chat-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatBot;
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './ChatBot.scss';
import messageIcon from '../../Assets/svg/message-icon.svg';

import botAvatar from '../../Assets/img/bot-avatar.png';
import userAvatar from '../../Assets/img/user-avatar.png';
import reloadIcon from '../../Assets/img/refresh.png';
import { Image } from 'cloudinary-react';

const SOCKET_SERVER_URL =
  process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:5006';
let socket;

const ChatBot = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef(null);
  const chatPanelRef = useRef(null);

  useEffect(() => {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('message', (message) => {
      if (message.sender === 'bot') {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...message,
            id: message.id || Date.now() + Math.random(),
            timestamp: message.timestamp || new Date().toISOString(),
          },
        ]);
        setLoading(false);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    socket.on('connect_error', (err) => {
      console.error('Chat connection error:', err);
      const errorMessage = {
        id: Date.now(),
        text: "Sorry, I'm having trouble connecting to the chat. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      setLoading(false);
    });

    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

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
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    const initialMessage = {
      id: Date.now(),
      text: 'Hi there! How can I assist you today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMessage]);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socket) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    socket.emit('sendMessage', { text: inputText });

    setInputText('');
    setLoading(true);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleViewProduct = ({ productId, type }) => {
    if (type === 'merch') {
      navigate(`/collections/merch-shop/${productId}`);
    } else navigate(`/collections/coffee-shop/${productId}`);
    setIsOpen(false);
  };

  return (
    <div
      className={`chat-bot-container ${isOpen ? 'open' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <motion.div
        className={`chat-bot-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        whileTap={{ scale: 0.9 }}
        drag
        dragConstraints={{
          top: -window.innerHeight + 80,
          left: -window.innerWidth + 80,
          right: 20,
          bottom: 20,
        }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
      >
        <img src={messageIcon} alt="Chat" className="message-icon" />
      </motion.div>

      {isOpen && (
        <motion.div
          className="chat-bot-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          ref={chatPanelRef}
        >
          <div className="chat-header">
            <div className="chat-title">
              <img src={botAvatar} alt="Bot" className="bot-avatar" />
              <h3>AI Assistant</h3>
            </div>
            <div className="chat-controls">
              <button className="clear-button" onClick={clearChat}>
                <img src={reloadIcon} alt="" width={20} height={20} />
              </button>
              <button className="close-button" onClick={toggleChat}>
                ×
              </button>
            </div>
          </div>

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
                      {message.recommendations.map((product) => (
                        <div key={product.id} className="recommended-product">
                          {typeof product.image === 'string' && (
                            <Image
                              cloudName="ok-but-first-coffee"
                              publicId={product.image}
                              crop="scale"
                              className="product-img"
                            />
                          )}
                          <div className="product-info">
                            <h4>{product.name}</h4>
                            <p>{product.description}</p>
                            <span className="product-price">
                              {product.price} $
                            </span>
                            <button
                              className="view-product-btn"
                              onClick={() =>
                                handleViewProduct({
                                  productId: product.id,
                                  type: product.type,
                                })
                              }
                            >
                              View Product
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
                <div className="message-content loading">
                  <div className="message-text">...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <textarea
              className="input-textarea"
              rows="1"
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatBot;

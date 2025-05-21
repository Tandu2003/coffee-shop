import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderApi } from '../Api/order';
import CartContext from '../Context/CartProvider';
import AuthContext from '../Context/AuthProvider';
import { withRetry } from '../utils/retryHandler';

const paymentMethods = [
  'Credit Card',
  'Debit Card',
  'PayPal',
  'Cash On Delivery',
];

const OrderPage = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const { auth } = useContext(AuthContext);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: auth.user?.username || 'Coffee Customer',
    address: '1234 Coffee Street',
    city: 'Coffee City',
    postalCode: '12345',
    country: 'USA',
    phoneNumber: '123-456-7890',
  });

  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]); // Default payment method
  const [notification, setNotification] = useState({
    show: false,
    message: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!auth.loggedIn) {
      navigate('/login');
      return;
    }

    const itemsPrice = parseFloat((cart.totalPrice || 0).toFixed(2));
    const shippingPrice = parseFloat((itemsPrice > 40 ? 0 : 5.99).toFixed(2));
    const taxRate = 0.0725;
    const taxPrice = parseFloat((itemsPrice * taxRate).toFixed(2));
    const totalPrice = parseFloat(
      (itemsPrice + shippingPrice + taxPrice).toFixed(2),
    );

    console.log({ auth });

    console.log('Auth user:', auth.user);

    const orderData = {
      orderItems: cart.items.map((item) => {
        const productType =
          item.productType ||
          (item.options?.bagSize
            ? 'coffee'
            : item.options?.size
              ? 'merch'
              : 'coffee');

        let options = item.options || {};

        if (productType === 'coffee' && (!options.bagSize || !options.grind)) {
          options = {
            ...options,
            bagSize: options.bagSize || 12,
            grind: options.grind || 'Whole Bean',
          };
        } else if (
          productType === 'merch' &&
          (!options.size || !options.color)
        ) {
          options = {
            ...options,
            size: options.size || 'M',
            color: options.color || 'Black',
          };
        }
        return {
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          productType,
          options,
        };
      }),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      note: '',
      user: auth.user._id, // Ensure you have user ID
    };

    try {
      setNotification({
        show: true,
        message: 'Processing your order...',
      });

      await withRetry(
        () => OrderApi.createOrder(orderData),
        (errorMessage) => {
          setNotification({
            show: true,
            message: errorMessage,
          });
        },
      );

      setNotification({
        show: true,
        message: 'Order placed successfully!',
      });
      setCart([]); // Clear cart after successful order
      navigate('/account'); // Redirect to a confirmation or profile page
      // Show notification if you have a system for it
    } catch (error) {
      console.error('Error creating order:', error);
      setNotification({
        show: true,
        message:
          error?.response?.data?.message ||
          'Failed to place order. Please try again.',
      });
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Your Cart is Empty</h2>
        <button onClick={() => navigate('/')} style={styles.button}>
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>
      <form onSubmit={handleSubmitOrder} style={styles.form}>
        <h2 style={styles.subtitle}>Shipping Address</h2>
        <input
          type="text"
          name="fullName"
          value={shippingAddress.fullName}
          onChange={handleInputChange}
          placeholder="Full Name"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="address"
          value={shippingAddress.address}
          onChange={handleInputChange}
          placeholder="Address"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="city"
          value={shippingAddress.city}
          onChange={handleInputChange}
          placeholder="City"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="postalCode"
          value={shippingAddress.postalCode}
          onChange={handleInputChange}
          placeholder="Postal Code"
          style={styles.input}
          required
        />
        <input
          type="text"
          name="country"
          value={shippingAddress.country}
          onChange={handleInputChange}
          placeholder="Country"
          style={styles.input}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          value={shippingAddress.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number"
          style={styles.input}
          required
        />

        <h2 style={styles.subtitle}>Payment Method</h2>
        <select
          name="paymentMethod"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          style={styles.input}
        >
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>

        <div style={styles.summary}>
          <h3 style={styles.subtitle}>Order Summary</h3>
          <p>Items: ${cart.totalPrice?.toFixed(2)}</p>
          <p>Shipping: ${(cart.totalPrice > 40 ? 0 : 5.99).toFixed(2)}</p>
          <p>Tax (7.25%): ${(cart.totalPrice * 0.0725).toFixed(2)}</p>
          <p style={styles.total}>
            Total: $
            {(
              cart.totalPrice +
              (cart.totalPrice > 40 ? 0 : 5.99) +
              cart.totalPrice * 0.0725
            ).toFixed(2)}
          </p>
        </div>

        <button type="submit" style={styles.button}>
          Place Order
        </button>
      </form>
      {notification.show && (
        <div className="cart-notification">
          <div className="notification-content">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ show: false, message: '' })}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '12rem auto',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem',
  },
  subtitle: {
    color: '#555',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
    marginTop: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  summary: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '4px',
  },
  total: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginTop: '0.5rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#5cb85c', // A common green color for confirm buttons
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    textAlign: 'center',
    textDecoration: 'none',
  },
};

export default OrderPage;

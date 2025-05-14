import { useEffect, useState } from 'react';
import { createContext } from 'react';

import { CartApi } from '../Api/cart';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await CartApi.getCart();
        setCart(result);
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const refreshCart = async () => {
    setLoading(true);
    try {
      const result = await CartApi.getCart();
      setCart(result);
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setLoading(false);
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, error, setCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

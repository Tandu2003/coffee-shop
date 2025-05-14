import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import GlobalStyles from './Components/GlobalStyles';
import { AuthProvider } from './Context/AuthProvider';
import { CartProvider } from './Context/CartProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GlobalStyles>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </GlobalStyles>
);

import React from 'react';
import { CartProvider } from '../contexts/CartContext';
import { ToastProvider } from '../contexts/ToastContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Tu Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;

export default function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ToastProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}
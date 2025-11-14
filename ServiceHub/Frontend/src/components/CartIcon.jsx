import React, { useState, useEffect } from 'react';

export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Load cart from localStorage directly, no hook needed
    try {
      const raw = localStorage.getItem('servicehub_cart_v1');
      if (raw) {
        const items = JSON.parse(raw);
        setCartCount(Array.isArray(items) ? items.length : 0);
      }
    } catch (e) {
      // ignore
    }

    // Listen to storage changes
    const handleStorageChange = () => {
      try {
        const raw = localStorage.getItem('servicehub_cart_v1');
        if (raw) {
          const items = JSON.parse(raw);
          setCartCount(Array.isArray(items) ? items.length : 0);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Only render in client
  if (!mounted) {
    return null;
  }

  return (
    <a href="/checkout" className="relative text-primary-light hover:text-primary-lightest px-3 py-2 flex items-center gap-1">
      🛒 Carrito
      {cartCount > 0 && (
        <span className="ml-2 bg-primary-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </a>
  );
}

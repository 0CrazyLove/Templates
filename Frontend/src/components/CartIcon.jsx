import React, { useState, useEffect } from 'react';

/**
 * Shopping cart icon component with item count badge.
 * 
 * Displays a cart icon in the navigation with a badge showing the number of items.
 * Synchronizes with localStorage to track cart changes across browser tabs.
 * Only renders on client to avoid SSR hydration mismatches.
 * 
 * @returns {JSX.Element|null} Cart icon with count badge or null if not mounted
 */
export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  /**
   * Initialize cart count from localStorage and listen for storage changes.
   * 
   * Handles cross-tab synchronization by listening to storage events,
   * allowing cart updates in one tab to be reflected in other tabs.
   */
  useEffect(() => {
    setMounted(true);

    // Load cart from localStorage directly (no hook needed for SSR compatibility)
    try {
      const raw = localStorage.getItem('servicehub_cart_v1');
      if (raw) {
        const items = JSON.parse(raw);
        setCartCount(Array.isArray(items) ? items.length : 0);
      }
    } catch (e) {
      console.error('Error loading cart count:', e);
    }

    /**
     * Handle storage changes from other tabs/windows.
     */
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
        console.error('Error updating cart count:', e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Only render on client to prevent hydration mismatches
  if (!mounted) {
    return null;
  }

  return (
    <a
      href="/checkout"
      className="relative text-primary-light hover:text-primary-accent transition-colors p-2"
      aria-label="Shopping Cart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>

      {cartCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm transform translate-x-1/4 -translate-y-1/4">
          {cartCount}
        </span>
      )}
    </a>
  );
}

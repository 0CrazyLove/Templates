import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import CartIcon from './CartIcon.jsx';

/**
 * Application header and navigation component.
 * 
 * Displays the main navigation bar with logo, menu, cart icon, and user profile menu.
 * Supports both authenticated and unauthenticated states.
 * Shows admin-only dashboard link for users with admin role.
 * Implements profile dropdown menu with logout functionality.
 * 
 * @returns {JSX.Element} Header element with navigation
 */
export default function Header() {
  const { user, isAuthenticated, logout, mounted } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  /**
   * Handle user logout and redirect to home page.
   */
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  /**
   * Check if current user has admin role.
   * 
   * Attempts to determine admin status through multiple methods:
   * 1. Check user object roles property
   * 2. Decode JWT token and look for role claims
   * 3. Search for OpenID Connect role claim URI
   * 
   * @returns {boolean} True if user has admin role
   * @private
   */
  const isUserAdmin = () => {
    try {
      const roles = user?.roles || user?.Roles || user?.RolesList || [];
      if (Array.isArray(roles) && roles.length > 0) {
        const normalized = roles.map((r) => String(r).toLowerCase());
        return (
          normalized.includes('admin') ||
          normalized.includes('administrator')
        );
      }
      const token = user?.token || user?.Token || null;
      if (token && typeof token === 'string') {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(
            atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
          );
          if (payload.role) {
            const r = Array.isArray(payload.role)
              ? payload.role
              : [payload.role];
            if (r.map((x) => String(x).toLowerCase()).includes('admin'))
              return true;
          }
          if (payload.roles) {
            const r = Array.isArray(payload.roles)
              ? payload.roles
              : [payload.roles];
            if (r.map((x) => String(x).toLowerCase()).includes('admin'))
              return true;
          }
          const roleClaimKey = Object.keys(payload).find((k) =>
            k.toLowerCase().includes('/role')
          );
          if (roleClaimKey) {
            const val = payload[roleClaimKey];
            const r = Array.isArray(val) ? val : [val];
            if (r.map((x) => String(x).toLowerCase()).includes('admin'))
              return true;
          }
        }
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
    return false;
  };

  /**
   * Update admin status when user or mount state changes.
   */
  useEffect(() => {
    if (!mounted) return;
    setShowAdmin(isUserAdmin());
  }, [mounted, user]);

  /**
   * Extract display name from user object with fallbacks.
   * 
   * @returns {string} User display name or email prefix
   * @private
   */
  const getDisplayName = () => {
    return (
      user?.displayName ||
      user?.Username ||
      user?.username ||
      user?.userName ||
      user?.email?.split('@')[0] ||
      'User'
    );
  };

  /**
   * Extract email from user object with fallback.
   * 
   * @returns {string} User email address
   * @private
   */
  const getEmail = () => {
    return user?.email || user?.Email || 'email@example.com';
  };

  /**
   * Close menus when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle mobile menu"]')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (showProfileMenu || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, isMobileMenuOpen]);

  /**
   * Handle scroll behavior to hide/show navbar.
   */
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // if scroll down and past 100px
          setIsVisible(false);
        } else { // if scroll up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  /**
     * Skeleton/placeholder header while component hydrates on client.
     * Maintains same structure as mounted component to prevent layout shift.
     * Shows loading state instead of auth buttons to prevent flash.
     */
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-primary-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-primary-lightest to-primary-light bg-clip-text text-transparent"
              >
                ServiceHub
              </a>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  /**
   * Fully mounted header with interactive elements and user state.
   */
  return (
    <header className={`sticky top-0 z-50 bg-primary-dark border-b border-white/5 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary-lightest to-primary-light bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              ServiceHub
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="/"
                className="text-primary-light hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/services"
                className="text-primary-light hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="/about"
                className="text-primary-light hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                About
              </a>
              {showAdmin && (
                <a
                  href="/dashboard"
                  className="text-primary-accent hover:text-primary-lightest px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Admin Panel
                </a>
              )}
            </div>
          </nav>

          {/* Right Side Icons & Profile */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4">
              <CartIcon />

              {isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-white transition-transform active:scale-95"
                    aria-label="Open profile menu"
                  >
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={getDisplayName()}
                        className="h-8 w-8 rounded-full object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-accent to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {getDisplayName().charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-primary-dark border border-white/10 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transform transition-all duration-200 ease-out">
                      <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                        <p className="text-sm text-white font-medium truncate">{getDisplayName()}</p>
                        <p className="text-xs text-gray-400 truncate">{getEmail()}</p>
                      </div>
                      <div className="py-1 border-t border-white/5">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <a
                    href="/login"
                    className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Login
                  </a>
                  <a
                    href="/registro"
                    className="bg-primary-accent hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary-accent/20 hover:shadow-primary-accent/40"
                  >
                    Register
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <div className="flex items-center gap-4 mr-4">
              <CartIcon />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="bg-white/5 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
              aria-label="Toggle mobile menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-dark border-b border-white/5" id="mobile-menu" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="text-gray-300 hover:bg-white/5 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="/services"
              className="text-gray-300 hover:bg-white/5 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Services
            </a>
            <a
              href="/about"
              className="text-gray-300 hover:bg-white/5 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              About
            </a>
            {showAdmin && (
              <a
                href="/dashboard"
                className="text-primary-accent hover:bg-primary-accent/10 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Admin Panel
              </a>
            )}
          </div>

          {isAuthenticated ? (
            <div className="pt-4 pb-4 border-t border-white/10">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  {user?.picture ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                      src={user.picture}
                      alt={getDisplayName()}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-accent to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {getDisplayName().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{getDisplayName()}</div>
                  <div className="text-sm font-medium leading-none text-gray-400 mt-1">{getEmail()}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <a
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  My Profile
                </a>
                <a
                  href="/orders"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  My Orders
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-4 border-t border-white/10 px-5 space-y-3">
              <a
                href="/login"
                className="block w-full text-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                Login
              </a>
              <a
                href="/registro"
                className="block w-full text-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-accent hover:bg-opacity-90 transition-colors"
              >
                Register
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
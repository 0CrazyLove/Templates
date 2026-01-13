import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './Login';

/**
 * Login wrapper component with OAuth provider setup.
 * 
 * Wraps the LoginForm component with GoogleOAuthProvider to enable
 * Google OAuth authentication. Reads Google Client ID from environment.
 * 
 * @returns {JSX.Element} Login form with OAuth providers
 */
const GOOGLE_CLIENT_ID = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;

export default function LoginWithProviders() {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID not found. Google Login will be disabled.');
    return <Login enableGoogle={false} />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Login />
    </GoogleOAuthProvider>
  );
}
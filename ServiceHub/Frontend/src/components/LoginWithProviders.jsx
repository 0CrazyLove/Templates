import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginForm from './LoginForm';

const GOOGLE_CLIENT_ID = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;

export default function LoginWithProviders() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { useAuth } from '../hooks/useAuth';
import { loginUser, googleCallback } from '../../Services/api';
import Toast from './Toast';
import Header from './Header';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { login } = useAuth();

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            showToast('Por favor completa todos los campos', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginUser({ email, password });
            login(response, response.token, response.refreshToken);
            showToast('¡Bienvenido! Has iniciado sesión correctamente', 'success');

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (error) {
            let errorMessage = 'Error al iniciar sesión';
            if (error.message?.includes('401')) errorMessage = 'Credenciales incorrectas';
            else if (error.message) errorMessage = error.message;

            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            setIsLoading(true);
            try {
                const response = await googleCallback(codeResponse.code);
                login(response, response.token, response.refreshToken);
                showToast('¡Bienvenido! Has iniciado sesión con Google', 'success');

                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } catch (error) {
                console.error('Google login error:', error);
                showToast('Error al iniciar sesión con Google', 'error');
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            showToast('Error al conectar con Google', 'error');
        }
    });

    return (
        <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-dark via-primary-darkest to-primary-darkest text-primary-lightest">
            <Header />
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column - Promotional Section */}
                <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">


                    <div className="relative z-20 flex flex-col items-center justify-center px-12 text-center w-full h-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-lg"
                        >
                            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                                Bienvenido de <span className="text-primary-accent">nuevo</span>
                            </h1>
                            <p className="text-base lg:text-lg text-primary-light/80 leading-relaxed">
                                Tu puerta de entrada a servicios profesionales de calidad. Conecta, colabora y crece con ServiceHub.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column - Form Section */}
                <div className="w-full lg:w-[40%] min-h-screen flex flex-col relative">
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

                    {/* Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
                    {/* Form Container */}
                    <div className="flex-1 flex flex-col justify-center px-6 lg:px-8 pb-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-md mx-auto w-full"
                        >
                            <h2 className="text-3xl font-bold text-white mb-2">Iniciar sesión</h2>
                            <p className="text-sm text-primary-light mb-8">
                                ¿No tienes una cuenta?{' '}
                                <a href="/registro" className="font-medium text-primary-accent hover:text-coral-hover transition-colors">
                                    Regístrate gratis
                                </a>
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-primary-light text-sm font-medium">
                                        Correo electrónico
                                    </Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-light/50 group-focus-within:text-primary-accent transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 h-12 bg-primary-dark border-primary-light/10 text-white placeholder:text-primary-light/30 focus:border-primary-accent focus:ring-primary-accent/20 rounded-xl transition-all"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Password field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-primary-light text-sm font-medium">
                                            Contraseña
                                        </Label>
                                        <a href="/forgot-password" className="text-xs font-medium text-primary-accent hover:text-coral-hover transition-colors">
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-light/50 group-focus-within:text-primary-accent transition-colors" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 pr-12 h-12 bg-primary-dark border-primary-light/10 text-white placeholder:text-primary-light/30 focus:border-primary-accent focus:ring-primary-accent/20 rounded-xl transition-all"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-light/50 hover:text-primary-accent transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 mt-6 bg-gradient-to-r from-primary-accent to-coral-hover hover:opacity-90 text-white font-semibold text-base rounded-xl transition-all duration-200 shadow-lg shadow-primary-accent/25"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        'Iniciar sesión'
                                    )}
                                </Button>
                            </form>

                            {/* Minimalist Gradient Separator */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-light/20 to-transparent"></div>
                                </div>
                            </div>

                            {/* Google button */}
                            <div>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 bg-primary-dark border-primary-light/10 text-white hover:bg-primary-medium/20 font-medium transition-all duration-200 rounded-xl"
                                    size="lg"
                                    disabled={isLoading}
                                    onClick={() => googleLogin()}
                                >
                                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </div>

                            {/* Terms and Privacy */}
                            <p className="text-xs text-primary-light/40 mt-8 text-center">
                                Al iniciar sesión, aceptas nuestros{' '}
                                <a href="#" className="text-primary-light/60 hover:text-primary-accent transition-colors">Términos de servicio</a>
                                {' '}y{' '}
                                <a href="#" className="text-primary-light/60 hover:text-primary-accent transition-colors">Política de privacidad</a>
                            </p>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="py-6 text-center relative z-10">
                        <p className="text-xs text-primary-light/20">
                            &copy; {new Date().getFullYear()} ServiceHub. Todos los derechos reservados.
                        </p>
                    </div>
                </div>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>
    );
}

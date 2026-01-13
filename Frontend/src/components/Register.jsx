import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../../Services/api';
import Toast from './Toast';
import Header from './Header';

export default function Register() {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { login } = useAuth();

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            showToast('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const response = await registerUser(formData);
            login(response, response.token, response.refreshToken);
            showToast('¡Cuenta creada con éxito!', 'success');

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (err) {
            let errorMessage = 'Error durante el registro';

            if (err.message?.includes('400') || err.message?.includes('Bad Request')) {
                errorMessage = 'Verifica que el correo no esté registrado y que los datos sean válidos.';
            } else if (err.message?.includes('409') || err.message?.includes('Conflict')) {
                errorMessage = 'Este correo ya está registrado. Prueba con otro.';
            } else if (err.message?.includes('500')) {
                errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

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
                                Únete a nuestra <span className="text-primary-accent">comunidad</span>
                            </h1>
                            <p className="text-base lg:text-lg text-primary-light/80 leading-relaxed">
                                Miles de profesionales y clientes ya confían en nosotros. ¡Sé parte de la revolución!
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
                            <h2 className="text-3xl font-bold text-white mb-2">Crear cuenta</h2>
                            <p className="text-sm text-primary-light mb-8">
                                ¿Ya tienes una cuenta?{' '}
                                <a href="/login" className="font-medium text-primary-accent hover:text-coral-hover transition-colors">
                                    Inicia sesión
                                </a>
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Username field */}
                                <div className="space-y-2">
                                    <Label htmlFor="userName" className="text-primary-light text-sm font-medium">
                                        Nombre de usuario
                                    </Label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-light/50 group-focus-within:text-primary-accent transition-colors" />
                                        <Input
                                            id="userName"
                                            name="userName"
                                            type="text"
                                            placeholder="johndoe"
                                            value={formData.userName}
                                            onChange={handleChange}
                                            required
                                            className="pl-12 h-12 bg-primary-dark border-primary-light/10 text-white placeholder:text-primary-light/30 focus:border-primary-accent focus:ring-primary-accent/20 rounded-xl transition-all"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Email field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-primary-light text-sm font-medium">
                                        Correo electrónico
                                    </Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-light/50 group-focus-within:text-primary-accent transition-colors" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="pl-12 h-12 bg-primary-dark border-primary-light/10 text-white placeholder:text-primary-light/30 focus:border-primary-accent focus:ring-primary-accent/20 rounded-xl transition-all"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Password field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-primary-light text-sm font-medium">
                                        Contraseña
                                    </Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-light/50 group-focus-within:text-primary-accent transition-colors" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
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

                                {/* Confirm Password field */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-primary-light text-sm font-medium">
                                        Confirmar contraseña
                                    </Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-light/50 group-focus-within:text-primary-accent transition-colors" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="pl-12 pr-12 h-12 bg-primary-dark border-primary-light/10 text-white placeholder:text-primary-light/30 focus:border-primary-accent focus:ring-primary-accent/20 rounded-xl transition-all"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-light/50 hover:text-primary-accent transition-colors focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                                            Creando cuenta...
                                        </>
                                    ) : (
                                        'Crear cuenta'
                                    )}
                                </Button>
                            </form>

                            {/* Terms and Privacy */}
                            <p className="text-xs text-primary-light/40 mt-8 text-center">
                                Al crear una cuenta, aceptas nuestros{' '}
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

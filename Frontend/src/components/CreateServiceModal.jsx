import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { createService } from '../../Services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

export default function CreateServiceModal({ isOpen, onClose, onServiceCreated }) {
    const { token } = useAuth();
    const { push: showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        priceType: 'project',
        category: '',
        provider: '',
        deliveryTime: '',
        imageUrl: '',
        languages: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Basic validation
            if (!formData.name || !formData.price || !formData.provider || !formData.deliveryTime) {
                throw new Error('Por favor completa los campos requeridos (*)');
            }

            const serviceData = {
                ...formData,
                price: parseFloat(formData.price),
                languages: ['Spanish'] // Default language for now
            };

            await createService(serviceData, token);

            showToast('Servicio creado exitosamente', 'success');
            onServiceCreated?.();
            onClose();

            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                priceType: 'project',
                category: '',
                provider: '',
                deliveryTime: '',
                imageUrl: '',
                languages: []
            });

        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al crear el servicio');
            showToast(err.message || 'Error al crear el servicio', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-primary-dark border border-primary-medium rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-primary-medium flex justify-between items-center sticky top-0 bg-primary-dark z-10">
                                <h2 className="text-2xl font-bold text-primary-lightest">Crear Nuevo Servicio</h2>
                                <button
                                    onClick={onClose}
                                    className="text-primary-light hover:text-primary-accent transition-colors p-2 hover:bg-primary-medium/30 rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-start gap-3">
                                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary-light">Nombre del Servicio *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-primary-darkest border border-primary-medium rounded-lg px-4 py-2.5 text-primary-lightest focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
                                            placeholder="Ej. Diseño de Logo Profesional"
                                        />
                                    </div>

                                    {/* Provider */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary-light">Proveedor *</label>
                                        <input
                                            type="text"
                                            name="provider"
                                            value={formData.provider}
                                            onChange={handleChange}
                                            className="w-full bg-primary-darkest border border-primary-medium rounded-lg px-4 py-2.5 text-primary-lightest focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
                                            placeholder="Ej. Studio Creativo"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary-light">Precio ($) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full bg-primary-darkest border border-primary-medium rounded-lg px-4 py-2.5 text-primary-lightest focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Price Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary-light">Tipo de Precio</label>
                                        <select
                                            name="priceType"
                                            value={formData.priceType}
                                            onChange={handleChange}
                                            className="w-full bg-primary-darkest border border-primary-medium rounded-lg px-4 py-2.5 text-primary-lightest focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="project">Por Proyecto</option>
                                            <option value="hour">Por Hora</option>
                                            <option value="month">Mensual</option>
                                        </select>
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary-light">Categoría</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-primary-darkest border border-primary-medium rounded-lg px-4 py-2.5 text-primary-lightest focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
                                            placeholder="Ej. Diseño Gráfico"
                                        />
                                    </div>

                                    {/* Delivery Time */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary-light">Tiempo de Entrega *</label>
                                        <input
                                            type="text"
                                            name="deliveryTime"
                                            value={formData.deliveryTime}
                                            onChange={handleChange}
                                            className="w-full bg-primary-darkest border border-primary-medium rounded-lg px-4 py-2.5 text-primary-lightest focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
                                            placeholder="Ej. 3-5 días"
                                        />
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary-light">URL de Imagen</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            className="w-full bg-primary-darkest border border-primary-medium rounded-lg pl-10 pr-4 py-2.5 text-primary-lightest focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                        <Upload className="absolute left-3 top-2.5 text-primary-light/50" size={18} />
                                    </div>
                                    {formData.imageUrl && (
                                        <div className="mt-2 h-32 w-full bg-primary-darkest rounded-lg overflow-hidden border border-primary-medium/50">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary-light">Descripción</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full bg-primary-darkest border border-primary-medium rounded-lg px-4 py-2.5 text-primary-lightest focus:ring-2 focus:ring-primary-accent focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Describe los detalles del servicio..."
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2.5 rounded-lg text-primary-light hover:text-primary-lightest hover:bg-primary-medium/30 transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 rounded-lg bg-primary-accent hover:bg-primary-accent/90 text-white font-medium shadow-lg shadow-primary-accent/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={18} />
                                                Crear Servicio
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

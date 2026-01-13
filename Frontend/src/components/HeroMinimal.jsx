import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';

/**
 * Minimalist Hero component.
 * 
 * A clean, modern introduction to the platform with smooth entry animations.
 * Focuses on typography and whitespace.
 * 
 * @returns {JSX.Element} Hero section
 */
export default function HeroMinimal() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.href = `/services?search=${encodeURIComponent(searchTerm)}`;
        }
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-dark to-primary-darkest py-20 lg:py-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />

            <div className="container relative mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-primary-lightest md:text-5xl lg:text-6xl">
                        Encuentra el talento perfecto para tu{' '}
                        <span className="text-primary-accent">próximo proyecto</span>
                    </h1>
                    <p className="mb-8 text-lg text-primary-light md:text-xl">
                        Conectamos empresas con profesionales verificados. Desde desarrollo hasta diseño,
                        encuentra el servicio que necesitas con garantía de calidad.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-light/50" />
                            <input
                                type="text"
                                placeholder="¿Qué servicio necesitas?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 text-base bg-primary-medium/30 text-primary-lightest placeholder-primary-light/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent border border-primary-light/10 transition-all focus:bg-primary-medium/50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="h-14 px-8 bg-primary-accent text-white rounded-lg font-medium text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-primary-accent/20 flex items-center justify-center gap-2"
                        >
                            Buscar
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>

                    {/* Popular Categories */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="text-sm text-primary-light">Popular:</span>
                        {['Diseño Web', 'Logo', 'WordPress', 'Video Edición'].map((tag) => (
                            <a
                                key={tag}
                                href={`/services?search=${encodeURIComponent(tag)}`}
                                className="rounded-full border border-primary-light/10 bg-primary-medium/20 px-3 py-1 text-sm text-primary-lightest transition-colors hover:border-primary-accent hover:text-primary-accent"
                            >
                                {tag}
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

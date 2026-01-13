import React from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Video, MessageSquare, Briefcase, TrendingUp } from 'lucide-react';

/**
 * Categories component.
 * 
 * Displays a grid of service categories.
 * Clicking a category navigates to the services page filtered by that category.
 * 
 * @returns {JSX.Element} Categories section
 */
export default function Categories() {
    const categories = [
        { icon: Code, label: 'Desarrollo', query: 'Desarrollo web', color: 'bg-blue-500/10 text-blue-500' },
        { icon: Palette, label: 'Diseño', query: 'Diseño gráfico', color: 'bg-purple-500/10 text-purple-500' },
        { icon: Video, label: 'Video', query: 'Video y gráficos en movimiento', color: 'bg-red-500/10 text-red-500' },
        { icon: MessageSquare, label: 'Marketing', query: 'Marketing digital', color: 'bg-green-500/10 text-green-500' },
        { icon: Briefcase, label: 'Negocios', query: 'Negocios', color: 'bg-orange-500/10 text-orange-500' },
        { icon: TrendingUp, label: 'Finanzas', query: 'Finanzas', color: 'bg-cyan-500/10 text-cyan-500' },
    ];

    return (
        <section className="py-20 bg-primary-darkest">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold text-primary-lightest md:text-4xl">
                        Explora por categoría
                    </h2>
                    <p className="mx-auto max-w-2xl text-primary-light">
                        Encuentra el servicio perfecto navegando por nuestras categorías más populares
                    </p>
                </motion.div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <a
                                href={`/services?category=${encodeURIComponent(category.query)}`}
                                className="group flex flex-col items-center gap-3 rounded-xl border border-primary-light/10 bg-primary-dark p-6 transition-all hover:border-primary-accent/30 hover:shadow-lg h-[142px] justify-center"
                            >
                                <div className={`rounded-xl p-4 ${category.color} transition-transform group-hover:scale-110`}>
                                    <category.icon className="h-6 w-6" />
                                </div>
                                <span className="font-medium text-primary-lightest">{category.label}</span>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

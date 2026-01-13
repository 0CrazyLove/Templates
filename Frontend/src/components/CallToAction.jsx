import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * CallToAction component.
 * 
 * Encourages users to sign up or explore services.
 * 
 * @returns {JSX.Element} CTA section
 */
export default function CallToAction() {
    return (
        <section className="py-20 bg-primary-darkest">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-2xl bg-primary-dark p-12 text-center md:p-16 border border-primary-light/10"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.2),transparent_50%)]" />

                    <div className="relative z-10">
                        <h2 className="mb-4 text-3xl font-bold text-primary-lightest md:text-4xl">
                            ¿Listo para empezar?
                        </h2>
                        <p className="mx-auto mb-8 max-w-xl text-primary-light">
                            Únete a miles de clientes satisfechos que ya encontraron el talento que buscaban
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <a
                                href="/services"
                                className="px-8 py-4 bg-primary-accent text-white rounded-lg font-medium text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-primary-accent/20 flex items-center justify-center gap-2"
                            >
                                Explorar servicios
                                <ArrowRight className="h-5 w-5" />
                            </a>
                            <a
                                href="/registro"
                                className="px-8 py-4 bg-transparent border border-primary-light/20 text-primary-lightest rounded-lg font-medium text-lg hover:bg-primary-light/5 transition-all"
                            >
                                Crear cuenta gratis
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

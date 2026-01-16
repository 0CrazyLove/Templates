import React from 'react';
import { motion } from 'framer-motion';

/**
 * Stats component.
 * 
 * Displays key platform statistics.
 * 
 * @returns {JSX.Element} Stats section
 */
export default function Stats() {
    const stats = [
        { value: '10K+', label: 'Professionals' },
        { value: '50K+', label: 'Projects completed' },
        { value: '4.9', label: 'Average rating' },
        { value: '24/7', label: 'Support' },
    ];

    return (
        <section className="border-y border-primary-light/10 bg-primary-dark py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-primary-lightest md:text-4xl">{stat.value}</div>
                            <div className="mt-1 text-sm text-primary-light">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

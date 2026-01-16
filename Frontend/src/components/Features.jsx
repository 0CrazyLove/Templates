import React from 'react';
import { motion } from 'framer-motion';

/**
 * Features component (How It Works).
 * 
 * Explains the platform's process in 3 simple steps.
 * 
 * @returns {JSX.Element} Features section
 */
export default function Features() {
    const steps = [
        {
            step: '01',
            title: 'Find the service',
            description: 'Explore our wide variety of professional services and find the one you need.',
        },
        {
            step: '02',
            title: 'Choose the professional',
            description: 'Compare profiles, reviews, and prices to find the ideal professional.',
        },
        {
            step: '03',
            title: 'Receive your project',
            description: 'Communicate with the professional and receive your project with satisfaction guarantee.',
        },
    ];

    return (
        <section className="bg-primary-darker py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold text-primary-lightest md:text-4xl">
                        How it works
                    </h2>
                    <p className="mx-auto max-w-2xl text-primary-light">
                        Hiring a professional has never been easier
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-3">
                    {steps.map((item, index) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative rounded-xl border border-primary-light/10 bg-primary-dark p-8"
                        >
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-accent text-xl font-bold text-white">
                                {item.step}
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-primary-lightest">{item.title}</h3>
                            <p className="text-primary-light">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

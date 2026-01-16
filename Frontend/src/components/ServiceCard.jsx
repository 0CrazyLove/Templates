import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, CheckCircle } from 'lucide-react';

/**
 * ServiceCard component.
 * 
 * Displays individual service details in a card format.
 * 
 * @param {Object} props
 * @param {Object} props.service - Service data
 * @param {number} props.index - Index for staggered animation
 * @returns {JSX.Element} Service card
 */
export default function ServiceCard({ service, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-primary-light/10 bg-primary-dark transition-colors transition-shadow duration-300 hover:border-primary-accent/30 hover:shadow-lg w-[324px] h-[440.5px]"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-primary-darkest">
                {service.imageUrl ? (
                    <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-primary-light">
                        No image
                    </div>
                )}
                {service.verified && (
                    <div className="absolute right-3 top-3 rounded-full bg-blue-500/90 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                        Verified
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                        <h3 className="line-clamp-1 font-semibold text-primary-lightest group-hover:text-primary-accent transition-colors">
                            {service.name}
                        </h3>
                        <p className="text-sm text-primary-light">{service.provider}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-primary-medium/20 px-1.5 py-0.5">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-primary-lightest">{service.rating.toFixed(1)}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="mb-4 line-clamp-2 text-sm text-primary-light/80 flex-1">
                    {service.description}
                </p>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between border-t border-primary-light/10 pt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-primary-light">From</span>
                        <span className="text-lg font-bold text-primary-lightest">
                            ${service.price}
                            <span className="text-xs font-normal text-primary-light/70 ml-1">
                                /{service.priceType === 'project' ? 'proj' : service.priceType}
                            </span>
                        </span>
                    </div>
                    <a
                        href={`/service/${service.id}`}
                        className="rounded-lg bg-primary-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-accent/90"
                    >
                        View details
                    </a>
                </div>
            </div>
        </motion.div>
    );
}

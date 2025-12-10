"use client";

import { motion } from "framer-motion";
import { ExperienceCard } from "./ExperienceCard";
import { EXPERIENCES } from "@/lib/mock-data";

export function FeaturedSection() {
    const featuredExperiences = EXPERIENCES.slice(0, 3);

    return (
        <section className="py-24 bg-surface relative z-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-white">
                            Trending This Week
                        </h2>
                        <p className="text-white/60 max-w-lg">
                            Discover the most coveted experiences happening in your city.
                        </p>
                    </div>
                    <a href="/explore" className="text-gold hover:text-white transition-colors border-b border-gold pb-1">
                        View All Experiences
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredExperiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <ExperienceCard experience={exp} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

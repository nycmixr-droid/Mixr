"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";

interface ExperienceProps {
    id: string | number;
    title: string;
    category: string;
    date: string;
    location: string;
    price: string;
    image: string;
    attendees: number;
}

export function ExperienceCard({ experience }: { experience: ExperienceProps }) {
    return (
        <Link href={`/events/${experience.id}`} className="block w-full">
            <motion.div
                className="group relative w-full h-[400px] rounded-2xl overflow-hidden cursor-pointer"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={experience.image}
                        alt={experience.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-black bg-gold rounded-full">
                                {experience.category}
                            </span>
                            <span className="text-white font-medium">{experience.price}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white font-heading mb-2 leading-tight">
                            {experience.title}
                        </h3>

                        <div className="flex flex-col gap-2 text-white/70 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gold" />
                                <span>{experience.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gold" />
                                <span>{experience.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Hover Reveal Details */}
                    <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-4 transition-all duration-300">
                        <div className="flex items-center gap-2 text-white/90 pt-2 border-t border-white/20">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{experience.attendees} attending</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

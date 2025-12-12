"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Calendar, MapPin, DollarSign, Users, Type, Image as ImageIcon, Sparkles } from "lucide-react";
import { ExperienceCard } from "@/components/landing/ExperienceCard";
import { MapboxAutocomplete } from "@/components/map/MapboxAutocomplete";
import { ImageUpload } from "@/components/upload/ImageUpload";

import { createEvent } from "@/lib/actions/events";

export default function CreateEventPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Nightlife",
        date: "",
        time: "",
        location: "",
        latitude: null as number | null,
        longitude: null as number | null,
        price: "",
        capacity: "",
        image: "https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=1000&auto=format&fit=crop", // Default placeholder
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Format date for display in preview
    const formattedDate = formData.date && formData.time
        ? `${new Date(formData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • ${new Date(`2000-01-01T${formData.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
        : "Date • Time";

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            await createEvent(formData);
            alert("Event created successfully!"); // Added success alert
        } catch (error) {
            console.error(error);
            alert("Failed to create event. Please try again.");
        } finally {
            setIsLoading(false); // Ensure loading state is reset
        }
    }

    return (
        <main className="min-h-screen bg-black text-white pb-20 selection:bg-gold selection:text-black">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium uppercase tracking-wider mb-4 border border-gold/20">
                        <Sparkles className="w-3 h-3" />
                        Host Mode
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                        Curate an Experience
                    </h1>
                    <p className="text-white/60 text-lg font-light">
                        Design a moment that matters. Watch your event come to life as you build it.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Form Section */}
                    <motion.div
                        className="lg:col-span-7 space-y-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={onSubmit} className="space-y-8">
                            {/* Basic Info Card */}
                            <div className="bg-surface p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gold text-sm">1</span>
                                    The Essentials
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-medium text-white/40 uppercase tracking-wider group-focus-within:text-gold transition-colors">Event Title</label>
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            type="text"
                                            placeholder="e.g., Midnight Jazz & Cocktails"
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-2xl font-heading text-white placeholder:text-white/10 focus:outline-none focus:border-gold transition-colors"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-xs font-medium text-white/40 uppercase tracking-wider group-focus-within:text-gold transition-colors">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Set the vibe. What can guests expect?"
                                            rows={3}
                                            className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white/80 placeholder:text-white/10 focus:outline-none focus:border-gold transition-colors resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider group-focus-within:text-gold transition-colors">Category</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer hover:bg-white/10"
                                            >
                                                <option>Nightlife</option>
                                                <option>Wellness</option>
                                                <option>Dining</option>
                                                <option>Networking</option>
                                                <option>Creative</option>
                                                <option>Culture</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2 group">
                                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider group-focus-within:text-gold transition-colors">Cover Image</label>
                                            <ImageUpload
                                                value={formData.image}
                                                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                                            />
                                            <input type="hidden" name="image" value={formData.image} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Logistics Card */}
                            <div className="bg-surface p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gold text-sm">2</span>
                                    Logistics
                                </h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider group-focus-within:text-gold transition-colors">Date</label>
                                            <input
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                type="date"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider group-focus-within:text-gold transition-colors">Time</label>
                                            <input
                                                name="time"
                                                value={formData.time}
                                                onChange={handleInputChange}
                                                type="time"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-xs font-medium text-white/40 uppercase tracking-wider group-focus-within:text-gold transition-colors">Location</label>
                                        <MapboxAutocomplete
                                            value={formData.location}
                                            onChange={(location, lat, lng) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    location,
                                                    latitude: lat ?? null,
                                                    longitude: lng ?? null,
                                                }));
                                            }}
                                            placeholder="Search for venue or address"
                                        />
                                        <input type="hidden" name="latitude" value={formData.latitude ?? ""} />
                                        <input type="hidden" name="longitude" value={formData.longitude ?? ""} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider group-focus-within:text-gold transition-colors">Price ($)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-gold/50" />
                                                <input
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    type="number"
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 group">
                                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider group-focus-within:text-gold transition-colors">Capacity</label>
                                            <div className="relative">
                                                <Users className="absolute left-4 top-3.5 w-5 h-5 text-gold/50" />
                                                <input
                                                    name="capacity"
                                                    value={formData.capacity}
                                                    onChange={handleInputChange}
                                                    type="number"
                                                    placeholder="Max Guests"
                                                    min="1"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full text-lg py-6 shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)] transition-shadow"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Publishing..." : "Launch Experience"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Live Preview Section */}
                    <motion.div
                        className="lg:col-span-5 hidden lg:block sticky top-32"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-white/40 uppercase tracking-wider px-2">
                                <span>Live Preview</span>
                                <span className="text-gold">Mobile View</span>
                            </div>

                            {/* Mobile Phone Frame Mockup */}
                            <div className="relative mx-auto border-gray-800 bg-gray-900 border-[8px] rounded-[2.5rem] h-[600px] w-[340px] shadow-2xl overflow-hidden">
                                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[10px] top-[72px] rounded-l-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[10px] top-[124px] rounded-l-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[10px] top-[178px] rounded-l-lg"></div>
                                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[10px] top-[142px] rounded-r-lg"></div>

                                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-black relative">
                                    {/* Status Bar Mock */}
                                    <div className="h-8 w-full bg-black flex items-center justify-between px-6 text-[10px] text-white font-medium z-20 relative">
                                        <span>9:41</span>
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                                            <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Preview Content */}
                                    <div className="p-4 pt-8">
                                        <div className="pointer-events-none transform scale-95 origin-top">
                                            <ExperienceCard
                                                experience={{
                                                    id: "preview",
                                                    title: formData.title || "Untitled Experience",
                                                    category: formData.category,
                                                    date: formattedDate,
                                                    location: formData.location || "Location TBD",
                                                    price: formData.price ? `$${formData.price}` : "Price",
                                                    image: formData.image || "https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=1000&auto=format&fit=crop",
                                                    attendees: 1 // Mock
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Bottom Indicator */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}

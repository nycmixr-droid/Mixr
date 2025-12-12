"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/Button";
import { MapboxAutocomplete } from "@/components/map/MapboxAutocomplete";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Image as ImageIcon, Clock, Sparkles } from "lucide-react";
import { createExperience } from "./actions";
import { ImageUpload } from "@/components/upload/ImageUpload";

export default function CreateExperiencePage() {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [locationTBD, setLocationTBD] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        deadlineHours: "2",
        location: "",
        latitude: null as number | null,
        longitude: null as number | null,
        visibility: "PUBLIC",
        audience: "ALL",
        image: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Check if user is signed in
        if (!isSignedIn) {
            alert("You must be signed in to create an experience");
            return;
        }

        setIsLoading(true);
        try {
            const formDataObj = new FormData(e.currentTarget);
            const result = await createExperience(formDataObj);
            if (result.success) {
                router.push("/feed");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create plans. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium uppercase tracking-wider mb-4 border border-gold/20">
                        <Sparkles className="w-3 h-3" />
                        Create Plans
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4">
                        What Are You Up To?
                    </h1>
                    <p className="text-white/60 text-lg">
                        Share your plans and let others join the adventure
                    </p>
                </motion.div>

                <motion.div
                    className="max-w-3xl mx-auto"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <form onSubmit={onSubmit} className="space-y-8">
                        {/* What & When */}
                        <div className="bg-surface p-8 rounded-3xl border border-white/10">
                            <h2 className="text-xl font-bold mb-6">The Basics</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-white/40 uppercase tracking-wider">
                                        What are you doing?
                                    </label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="e.g., Late night coffee run, Pickup basketball, Exploring downtown"
                                        className="w-full bg-transparent border-b border-white/10 py-3 text-2xl font-heading text-white placeholder:text-white/10 focus:outline-none focus:border-gold transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-white/40 uppercase tracking-wider">
                                        Tell us more
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="What should people expect?"
                                        rows={3}
                                        className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white/80 placeholder:text-white/10 focus:outline-none focus:border-gold transition-colors resize-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-white/40 uppercase tracking-wider">
                                            Date
                                        </label>
                                        <input
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            type="date"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-white/40 uppercase tracking-wider">
                                            Time
                                        </label>
                                        <input
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            type="time"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-white/40 uppercase tracking-wider">
                                            Deadline (hours before)
                                        </label>
                                        <select
                                            name="deadlineHours"
                                            value={formData.deadlineHours}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                                        >
                                            <option value="0.5">30 min</option>
                                            <option value="1">1 hour</option>
                                            <option value="2">2 hours</option>
                                            <option value="4">4 hours</option>
                                            <option value="24">1 day</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Where */}
                        <div className="bg-surface p-8 rounded-3xl border border-white/10">
                            <h2 className="text-xl font-bold mb-6">Where?</h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="locationTBD"
                                        checked={locationTBD}
                                        onChange={(e) => setLocationTBD(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-gold focus:ring-gold"
                                    />
                                    <label htmlFor="locationTBD" className="text-sm text-white/70">
                                        Location TBD (figure it out later)
                                    </label>
                                </div>

                                {!locationTBD && (
                                    <>
                                        <MapboxAutocomplete
                                            value={formData.location}
                                            onChange={(location, lat, lng) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    location,
                                                    latitude: lat ?? null,
                                                    longitude: lng ?? null,
                                                }));
                                            }}
                                            placeholder="Search for a place"
                                        />
                                        <input type="hidden" name="latitude" value={formData.latitude ?? ""} />
                                        <input type="hidden" name="longitude" value={formData.longitude ?? ""} />
                                    </>
                                )}
                                <input type="hidden" name="locationTBD" value={locationTBD.toString()} />
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-surface p-8 rounded-3xl border border-white/10">
                            <h2 className="text-xl font-bold mb-6">Settings</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-white/40 uppercase tracking-wider">
                                        Visibility
                                    </label>
                                    <select
                                        name="visibility"
                                        value={formData.visibility}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                                    >
                                        <option value="PUBLIC">Public (Anyone can join)</option>
                                        <option value="PRIVATE">Private (Approval Required)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-white/40 uppercase tracking-wider">
                                        Audience
                                    </label>
                                    <select
                                        name="audience"
                                        value={formData.audience}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                                    >
                                        <option value="ALL">All Genders</option>
                                        <option value="MEN_ONLY">Men Only</option>
                                        <option value="WOMEN_ONLY">Women Only</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-white/40 uppercase tracking-wider">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                                    >
                                        <option value="">None</option>
                                        <option>Nightlife</option>
                                        <option>Food & Drink</option>
                                        <option>Sports</option>
                                        <option>Adventure</option>
                                        <option>Creative</option>
                                        <option>Chill</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2 block">
                                        Cover Image (optional)
                                    </label>
                                    <ImageUpload
                                        value={formData.image}
                                        onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                                    />
                                    <input type="hidden" name="image" value={formData.image} />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full text-lg py-6"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "🚀 Share Your Plan"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}

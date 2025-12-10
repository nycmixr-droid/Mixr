"use client";

import { Button } from "@/components/ui/Button";
import { MapboxAutocomplete } from "@/components/map/MapboxAutocomplete";
import { useState } from "react";
import { updateEvent } from "./actions";
import { useRouter } from "next/navigation";
import { Calendar, DollarSign, Users, Image as ImageIcon } from "lucide-react";

type Event = {
    id: string;
    title: string;
    description: string;
    category: string | null;
    date: Date;
    location: string;
    latitude: number | null;
    longitude: number | null;
    price: number;
    capacity: number | null;
    image: string | null;
};

export default function EventEditClient({ event }: { event: Event }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Format date and time for inputs
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toISOString().split("T")[0];
    const timeStr = eventDate.toTimeString().slice(0, 5);

    const [formData, setFormData] = useState({
        title: event.title,
        description: event.description,
        category: event.category || "Nightlife",
        date: dateStr,
        time: timeStr,
        location: event.location,
        latitude: event.latitude,
        longitude: event.longitude,
        price: event.price.toString(),
        capacity: event.capacity?.toString() || "",
        image: event.image || "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formDataObj = new FormData(e.currentTarget);
            await updateEvent(event.id, formDataObj);
            alert("Event updated successfully!");
            router.push("/host/dashboard");
        } catch (error) {
            console.error(error);
            alert("Failed to update event. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-heading mb-2">Edit Event</h1>
                <p className="text-white/70">Update your event details</p>
            </div>

            <form onSubmit={onSubmit} className="max-w-3xl space-y-8">
                {/* Basic Info */}
                <div className="bg-surface p-8 rounded-3xl border border-white/10">
                    <h2 className="text-xl font-bold mb-6">Basic Information</h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                Event Title
                            </label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full bg-transparent border-b border-white/10 py-3 text-2xl font-heading text-white focus:outline-none focus:border-gold transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white/80 focus:outline-none focus:border-gold transition-colors resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                                >
                                    <option>Nightlife</option>
                                    <option>Wellness</option>
                                    <option>Dining</option>
                                    <option>Networking</option>
                                    <option>Creative</option>
                                    <option>Culture</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                    Cover Image URL
                                </label>
                                <div className="relative">
                                    <input
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                                    />
                                    <ImageIcon className="absolute right-4 top-3.5 w-5 h-5 text-white/20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logistics */}
                <div className="bg-surface p-8 rounded-3xl border border-white/10">
                    <h2 className="text-xl font-bold mb-6">Logistics</h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
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
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
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
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                Location
                            </label>
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
                                placeholder="Search for venue or address"
                            />
                            <input type="hidden" name="latitude" value={formData.latitude ?? ""} />
                            <input type="hidden" name="longitude" value={formData.longitude ?? ""} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                    Price ($)
                                </label>
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

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                    Capacity
                                </label>
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

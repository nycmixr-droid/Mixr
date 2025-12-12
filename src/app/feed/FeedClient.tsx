"use client";

import { ExperienceCard } from "@/components/landing/ExperienceCard";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { Button } from "@/components/ui/Button";
import { ExperienceMap } from "@/components/map/ExperienceMap";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, MapPin, Calendar, Clock, Map, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Experience = {
    id: string;
    title: string;
    description: string;
    category: string | null;
    date: Date;
    rsvpDeadline: Date;
    location: string;
    locationTBD: boolean;
    latitude: number | null;
    longitude: number | null;
    image: string | null;
    host: {
        id: string;
        name: string | null;
        image: string | null;
    };
    _count: {
        participants: number;
    };
};

export default function FeedClient({ experiences }: { experiences: Experience[] }) {
    const router = useRouter();
    const [filter, setFilter] = useState<"all" | "now" | "today" | "week">("all");
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const filteredExperiences = experiences.filter((exp) => {
        const expDate = new Date(exp.date);
        const deadline = new Date(exp.rsvpDeadline);

        // Don't show expired deadlines
        if (deadline < now) return false;

        switch (filter) {
            case "now":
                return expDate.getTime() - now.getTime() < 2 * 60 * 60 * 1000; // Next 2 hours
            case "today":
                return expDate <= today;
            case "week":
                return expDate <= weekEnd;
            default:
                return true;
        }
    });

    // Sort by deadline urgency (soonest first)
    const sortedExperiences = [...filteredExperiences].sort((a, b) => {
        return new Date(a.rsvpDeadline).getTime() - new Date(b.rsvpDeadline).getTime();
    });

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-heading mb-2">Live Feed</h1>
                    <p className="text-white/70">Join experiences happening right now</p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${viewMode === "list"
                                ? "bg-gold text-black border-gold"
                                : "bg-transparent text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                                }`}
                        >
                            <List className="w-4 h-4" />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode("map")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${viewMode === "map"
                                ? "bg-gold text-black border-gold"
                                : "bg-transparent text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                                }`}
                        >
                            <Map className="w-4 h-4" />
                            Map
                        </button>
                    </div>
                </div>

                {/* Filters (only show in list view) */}
                {viewMode === "list" && (
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                        {[
                            { key: "all", label: "All" },
                            { key: "now", label: "🔥 Happening Now" },
                            { key: "today", label: "Today" },
                            { key: "week", label: "This Week" },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key as any)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${filter === f.key
                                    ? "bg-gold text-black border-gold"
                                    : "bg-transparent text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Map View */}
                {viewMode === "map" && (
                    <ExperienceMap
                        experiences={sortedExperiences.map((exp) => ({
                            id: exp.id,
                            title: exp.title,
                            latitude: exp.latitude,
                            longitude: exp.longitude,
                            location: exp.location,
                            locationTBD: exp.locationTBD,
                        }))}
                        onMarkerClick={(id) => router.push(`/events/${id}`)}
                    />
                )}

                {/* List View */}
                {viewMode === "list" && (
                    <>
                        {sortedExperiences.length === 0 ? (
                            <div className="bg-surface border border-white/10 rounded-2xl p-12 text-center">
                                <Clock className="w-12 h-12 text-white/30 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No experiences yet</h3>
                                <p className="text-white/70 mb-6">Be the first to create one!</p>
                                <Link href="/create">
                                    <Button>Create Experience</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {sortedExperiences.map((exp) => (
                                    <ExperienceFeedCard key={exp.id} experience={exp} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function ExperienceFeedCard({ experience }: { experience: Experience }) {
    return (
        <div className="bg-surface border border-white/10 rounded-3xl overflow-hidden hover:border-gold/30 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Left: Image & Host */}
                <div className="space-y-4">
                    {experience.image && (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden">
                            <Image
                                src={experience.image}
                                alt={experience.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <Link href={`/profile/${experience.host.id}`}>
                        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            {experience.host.image && (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gold/30">
                                    <Image
                                        src={experience.host.image}
                                        alt={experience.host.name || "Host"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-white/50">Hosted by</p>
                                <p className="font-medium hover:text-gold transition-colors">
                                    {experience.host.name || "Anonymous"}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Middle: Details */}
                <div className="space-y-4">
                    {experience.category && (
                        <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider text-black bg-gold rounded-full">
                            {experience.category}
                        </span>
                    )}
                    <h3 className="text-2xl font-bold font-heading">{experience.title}</h3>
                    <p className="text-white/70">{experience.description}</p>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-white/70">
                            <Calendar className="w-4 h-4 text-gold" />
                            <span>{new Date(experience.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <MapPin className="w-4 h-4 text-gold" />
                            <span>
                                {experience.locationTBD ? "Location TBD" : experience.location}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                            <Users className="w-4 h-4 text-gold" />
                            <span>
                                {experience._count.participants} joined
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: CTA */}
                <div className="flex flex-col justify-between">
                    <div className="space-y-4">
                        <CountdownTimer deadline={experience.rsvpDeadline} />
                    </div>

                    <Link href={`/events/${experience.id}`} className="mt-4">
                        <Button size="lg" className="w-full">
                            Join Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

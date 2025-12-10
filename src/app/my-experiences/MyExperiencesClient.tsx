"use client";

import { ExperienceCard } from "@/components/landing/ExperienceCard";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type Experience = {
    id: string;
    title: string;
    description: string;
    category: string | null;
    date: Date;
    location: string;
    image: string | null;
    host: {
        name: string | null;
        image: string | null;
    };
    _count: {
        participants: number;
    };
};

export default function MyExperiencesClient({ experiences }: { experiences: Experience[] }) {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-heading mb-2">My Experiences</h1>
                    <p className="text-white/70">Experiences you've joined</p>
                </div>

                {/* Experiences Grid */}
                {experiences.length === 0 ? (
                    <div className="bg-surface border border-white/10 rounded-2xl p-12 text-center">
                        <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No experiences yet</h3>
                        <p className="text-white/70 mb-6">
                            Join an experience from the feed to get started!
                        </p>
                        <Link href="/feed">
                            <Button>Browse Feed</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {experiences.map((exp) => (
                            <ExperienceCard
                                key={exp.id}
                                experience={{
                                    id: exp.id,
                                    title: exp.title,
                                    category: exp.category || "Experience",
                                    date: new Date(exp.date).toLocaleDateString(),
                                    location: exp.location,
                                    price: "Free",
                                    image: exp.image || "/placeholder.jpg",
                                    attendees: exp._count.participants,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

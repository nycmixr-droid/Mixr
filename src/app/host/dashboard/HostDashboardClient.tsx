"use client";

import { Button } from "@/components/ui/Button";
import { Calendar, Users, DollarSign, Edit, QrCode } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Event = {
    id: string;
    title: string;
    date: Date;
    location: string;
    image: string | null;
    published: boolean;
    _count: {
        participants: number;
    };
};

type Stats = {
    totalEvents: number;
    totalParticipants: number;
    totalRevenue: number;
};

export default function HostDashboardClient({
    stats,
    events,
}: {
    stats: Stats;
    events: Event[];
}) {
    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-heading mb-2">Dashboard</h1>
                <p className="text-white/70">Manage your experiences</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold/10 rounded-xl">
                            <Calendar className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Total Events</p>
                            <p className="text-3xl font-bold font-heading">{stats.totalEvents}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold/10 rounded-xl">
                            <Users className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Total Participants</p>
                            <p className="text-3xl font-bold font-heading">{stats.totalParticipants}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold/10 rounded-xl">
                            <DollarSign className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold font-heading">
                                ${stats.totalRevenue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events List */}
            <div className="bg-surface border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold font-heading">Your Experiences</h2>
                    <Link href="/create">
                        <Button>Create New</Button>
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-white/50 mb-4">No experiences yet</p>
                        <Link href="/create">
                            <Button>Create Your First Experience</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:border-gold/30 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        {event.image && (
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-white/70">
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                                <span>{event.location}</span>
                                                <span className="text-gold font-medium">
                                                    {event._count.participants} participants
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={`/host/events/${event.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Link href="/host/scan">
                                            <Button variant="outline" size="sm">
                                                <QrCode className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

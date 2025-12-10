import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/Button";
import { MapView } from "@/components/map/MapView";
import { getEventById } from "@/lib/actions/events";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowLeft, Share2, Heart, Clock } from "lucide-react";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    // Format date and time
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            {/* Hero Image */}
            <div className="relative h-[50vh] w-full">
                <Image
                    src={event.image || "/placeholder.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute top-24 left-4 md:left-8 z-10">
                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-gold/50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Explore</span>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 -mt-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Title Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-black bg-gold rounded-full">
                                    {event.category}
                                </span>
                                <span className="text-gold/80 text-sm font-medium tracking-wide">
                                    {event._count.rsvps} people attending
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight">
                                {event.title}
                            </h1>
                        </div>

                        {/* Host Info */}
                        <div className="flex items-center gap-4 p-6 bg-surface rounded-2xl border border-white/5">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold/20">
                                <Image
                                    src={event.host.image || "/placeholder-avatar.jpg"}
                                    alt={event.host.name || "Host"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-white/60 text-sm uppercase tracking-wider mb-1">Hosted by</p>
                                <h3 className="text-xl font-bold text-white">{event.host.name || "Host"}</h3>
                                <p className="text-white/40 text-sm">{event.host.bio || "Community Host"}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold font-heading text-gold">About the Experience</h2>
                            <p className="text-lg text-white/70 leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>

                        {/* Map */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold font-heading text-gold">Location</h2>
                            <div className="flex items-center gap-2 text-white/60 mb-2">
                                <MapPin className="w-5 h-5 text-gold" />
                                <span>{event.location}</span>
                            </div>
                            <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10">
                                <MapView
                                    locations={[{
                                        id: event.id,
                                        latitude: event.latitude || 40.7128,
                                        longitude: event.longitude || -74.0060,
                                        title: event.title,
                                        description: event.location
                                    }]}
                                    center={{ lat: event.latitude || 40.7128, lng: event.longitude || -74.0060 }}
                                    zoom={14}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-surface p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-gold">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-sm uppercase tracking-wider">Date</p>
                                            <p className="text-white font-medium text-lg">{dateStr}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-gold">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-sm uppercase tracking-wider">Time</p>
                                            <p className="text-white font-medium text-lg">{timeStr}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-gold">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-sm uppercase tracking-wider">Location</p>
                                            <p className="text-white font-medium text-lg">{event.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/10" />

                                {/* <div className="flex items-center justify-between">
                                    <span className="text-white/60">Price</span>
                                    <span className="text-3xl font-bold text-white">
                                        {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                                    </span>
                                </div> */}

                                <Button size="lg" className="w-full text-lg py-6">
                                    RSVP Now
                                </Button>

                                <p className="text-center text-white/30 text-xs">
                                    Limited spots available. Approval required.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1 gap-2">
                                    <Share2 className="w-4 h-4" /> Share
                                </Button>
                                <Button variant="outline" className="flex-1 gap-2">
                                    <Heart className="w-4 h-4" /> Save
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

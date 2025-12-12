import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/Button";
import { MapView } from "@/components/map/MapView";
import { getEventById } from "@/lib/actions/events";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowLeft, Clock, Lock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getMessages } from "./chat-actions";
import { EventChat } from "@/components/chat/EventChat";
import { ManageRequests } from "@/components/events/ManageRequests";
import { getPendingRequests } from "./manage-actions";
import { JoinEventButton } from "@/components/events/JoinEventButton";
import { LocationDisplay } from "@/components/events/LocationDisplay";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();
    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    const currentUser = userId ? await db.user.findUnique({ where: { clerkId: userId } }) : null;

    // Check visibility and access
    const isHost = userId && event.hostId === currentUser?.id;
    const userRsvp = userId ? await db.rSVP.findUnique({
        where: {
            userId_eventId: {
                userId: currentUser?.id || "",
                eventId: id,
            },
        },
    }) : null;

    const isConfirmedParticipant = userRsvp?.status === "CONFIRMED";
    const isPendingParticipant = userRsvp?.status === "PENDING";

    const canViewDetails = event.visibility === "PUBLIC" || isHost || isConfirmedParticipant;

    // Format date and time
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    // Fetch messages if allowed
    const messages = (isHost || isConfirmedParticipant) ? await getMessages(id) : [];

    // Fetch pending requests if host
    const pendingRequests = isHost ? await getPendingRequests(id) : [];

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            {/* Hero Image */}
            <div className="relative h-[50vh] w-full">
                <Image
                    src={event.image || "/placeholder.jpg"}
                    alt={event.title}
                    fill
                    className={`object-cover ${!canViewDetails ? "blur-xl" : ""}`}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute top-24 left-4 md:left-8 z-10">
                    <Link
                        href="/feed"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-gold/50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Feed</span>
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
                                    {event._count.participants} people attending
                                </span>
                                {event.visibility === "PRIVATE" && (
                                    <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-white bg-white/10 rounded-full flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Private
                                    </span>
                                )}
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

                        {canViewDetails ? (
                            <>
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
                                    <LocationDisplay
                                        location={event.location}
                                        latitude={event.latitude}
                                        longitude={event.longitude}
                                        showIcon={true}
                                        className="text-white/60 mb-2"
                                    />
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

                                {/* Chat */}
                                {(isHost || isConfirmedParticipant) && (
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-bold font-heading text-gold">Discussion</h2>
                                        <EventChat eventId={event.id} initialMessages={messages} />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-surface border border-white/10 rounded-2xl p-12 text-center">
                                <Lock className="w-16 h-16 text-gold mx-auto mb-6" />
                                <h2 className="text-3xl font-bold font-heading mb-4">Private Experience</h2>
                                <p className="text-white/60 text-lg max-w-md mx-auto mb-8">
                                    This experience is private. You must request access or be invited to view the full details and location.
                                </p>
                                <JoinEventButton
                                    eventId={event.id}
                                    visibility={event.visibility}
                                    audience={event.audience}
                                    userGender={currentUser?.gender}
                                />
                            </div>
                        )}

                        {/* Host Management: Pending Requests */}
                        {isHost && event.visibility === "PRIVATE" && (
                            <ManageRequests eventId={event.id} initialRequests={pendingRequests} />
                        )}
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

                                    {canViewDetails && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl text-gold">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-white/40 text-sm uppercase tracking-wider">Location</p>
                                                <LocationDisplay
                                                    location={event.location}
                                                    latitude={event.latitude}
                                                    longitude={event.longitude}
                                                    className="text-white font-medium text-lg"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-white/10" />

                                {!isConfirmedParticipant && !isPendingParticipant && !isHost && (
                                    <JoinEventButton
                                        eventId={event.id}
                                        visibility={event.visibility}
                                        audience={event.audience}
                                        userGender={currentUser?.gender}
                                        className="w-full text-lg py-6"
                                    />
                                )}

                                {isPendingParticipant && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                                        <p className="text-yellow-500 font-medium">Request Pending</p>
                                    </div>
                                )}

                                {isConfirmedParticipant && (
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                                        <p className="text-green-500 font-medium">You're going!</p>
                                    </div>
                                )}

                                <p className="text-center text-white/30 text-xs">
                                    {event.visibility === "PRIVATE" ? "Approval required" : "Instant confirmation"}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

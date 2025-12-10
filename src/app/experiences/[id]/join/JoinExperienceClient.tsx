"use client";

import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { FollowButton } from "@/components/profile/FollowButton";
import { useState } from "react";
import { joinExperience } from "./actions";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Users, MapPin, Calendar, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Experience = {
    id: string;
    title: string;
    description: string;
    date: Date;
    rsvpDeadline: Date;
    location: string;
    locationTBD: boolean;
    image: string | null;
    maxParticipants: number | null;
    host: {
        id: string;
        name: string | null;
        image: string | null;
        _count?: {
            followers: number;
        };
        isFollowing?: boolean;
    };
    participants: Array<{
        user: {
            name: string | null;
            image: string | null;
        };
    }>;
    _count: {
        participants: number;
    };
};

export default function JoinExperienceClient({ experience }: { experience: Experience }) {
    const router = useRouter();
    const { userId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await joinExperience(experience.id);
            router.push("/my-experiences");
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const spotsLeft = experience.maxParticipants
        ? experience.maxParticipants - experience._count.participants
        : null;

    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Experience Details */}
                    <div>
                        {experience.image && (
                            <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6">
                                <Image
                                    src={experience.image}
                                    alt={experience.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <h1 className="text-4xl font-bold font-heading mb-4">{experience.title}</h1>
                        <p className="text-white/70 mb-6">{experience.description}</p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-white/80">
                                <Calendar className="w-5 h-5 text-gold" />
                                <span>{new Date(experience.date).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <MapPin className="w-5 h-5 text-gold" />
                                <span>
                                    {experience.locationTBD ? "Location TBD" : experience.location}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <Users className="w-5 h-5 text-gold" />
                                <span>
                                    {experience._count.participants} joined
                                    {spotsLeft !== null && ` • ${spotsLeft} spots left`}
                                </span>
                            </div>
                        </div>

                        {/* Host Info with Follow Button */}
                        <div className="bg-surface border border-white/10 rounded-2xl p-6">
                            <p className="text-sm text-white/50 mb-3">Hosted by</p>
                            <div className="flex items-center justify-between">
                                <Link href={`/profile/${experience.host.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    {experience.host.image && (
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold/30">
                                            <Image
                                                src={experience.host.image}
                                                alt={experience.host.name || "Host"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-lg hover:text-gold transition-colors">
                                            {experience.host.name || "Anonymous"}
                                        </p>
                                    </div>
                                </Link>
                                {userId && experience.host._count !== undefined && experience.host.isFollowing !== undefined && (
                                    <FollowButton
                                        userId={experience.host.id}
                                        initialIsFollowing={experience.host.isFollowing}
                                        initialFollowerCount={experience.host._count.followers}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Participants Preview */}
                        {experience.participants.length > 0 && (
                            <div className="mt-6">
                                <p className="text-sm text-white/50 mb-3">Who's joining</p>
                                <div className="flex -space-x-3">
                                    {experience.participants.slice(0, 5).map((p, i) => (
                                        <div
                                            key={i}
                                            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-black"
                                        >
                                            {p.user.image ? (
                                                <Image
                                                    src={p.user.image}
                                                    alt={p.user.name || "Participant"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                                                    {p.user.name?.[0] || "?"}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {experience.participants.length > 5 && (
                                        <div className="relative w-10 h-10 rounded-full bg-surface border-2 border-black flex items-center justify-center text-xs font-medium">
                                            +{experience.participants.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Join Card */}
                    <div className="bg-surface border border-white/10 rounded-3xl p-8 h-fit sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="w-8 h-8 text-gold" />
                            <h2 className="text-2xl font-bold font-heading">Join This Experience</h2>
                        </div>

                        <div className="mb-6">
                            <CountdownTimer deadline={experience.rsvpDeadline} />
                        </div>

                        {spotsLeft !== null && spotsLeft <= 3 && spotsLeft > 0 && (
                            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-red-500 font-medium">
                                    ⚠️ Only {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left!
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        )}

                        <Button
                            onClick={handleJoin}
                            size="lg"
                            className="w-full"
                            disabled={isLoading || (spotsLeft !== null && spotsLeft <= 0)}
                        >
                            {isLoading ? "Joining..." : spotsLeft === 0 ? "Full" : "Join Now - It's Free!"}
                        </Button>

                        <p className="text-xs text-white/50 text-center mt-4">
                            You'll be able to connect with the host and other participants after joining
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

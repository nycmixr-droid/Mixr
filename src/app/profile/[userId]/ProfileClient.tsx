"use client";

import { useState } from "react";
import { ExperienceCard } from "@/components/landing/ExperienceCard";
import { FollowButton } from "@/components/profile/FollowButton";
import { FollowModal } from "@/components/profile/FollowModal";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Calendar, Edit2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

type User = {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    gender: string | null;
    _count: {
        hostedExperiences: number;
        joinedExperiences: number;
        followers: number;
        following: number;
    };
    isFollowing: boolean;
};

type Experience = {
    id: string;
    title: string;
    description: string;
    category: string | null;
    date: Date;
    location: string;
    image: string | null;
    _count: {
        participants: number;
    };
};

export default function ProfileClient({
    user,
    hostedExperiences,
    joinedExperiences,
    isOwnProfile,
}: {
    user: User;
    hostedExperiences: Experience[];
    joinedExperiences: Experience[];
    isOwnProfile: boolean;
}) {
    const [activeTab, setActiveTab] = useState<"hosted" | "joined">("hosted");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"followers" | "following">("followers");
    const [editModalOpen, setEditModalOpen] = useState(false);

    const displayExperiences = activeTab === "hosted" ? hostedExperiences : joinedExperiences;

    const openModal = (type: "followers" | "following") => {
        setModalType(type);
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                {/* Profile Header */}
                <div className="bg-surface border border-white/10 rounded-3xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gold/30 flex-shrink-0">
                            {user.image ? (
                                <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gold/20 flex items-center justify-center text-gold text-3xl font-bold">
                                    {user.name?.[0] || "?"}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold font-heading mb-2">{user.name || "Anonymous"}</h1>
                            {user.bio && <p className="text-white/70 mb-4">{user.bio}</p>}

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div>
                                    <span className="text-gold font-bold">{user._count.hostedExperiences}</span>
                                    <span className="text-white/60 ml-1">hosted</span>
                                </div>
                                <div>
                                    <span className="text-gold font-bold">{user._count.joinedExperiences}</span>
                                    <span className="text-white/60 ml-1">joined</span>
                                </div>
                                <button
                                    onClick={() => openModal("followers")}
                                    className="hover:text-gold transition-colors cursor-pointer"
                                >
                                    <span className="text-gold font-bold">{user._count.followers}</span>
                                    <span className="text-white/60 ml-1">followers</span>
                                </button>
                                <button
                                    onClick={() => openModal("following")}
                                    className="hover:text-gold transition-colors cursor-pointer"
                                >
                                    <span className="text-gold font-bold">{user._count.following}</span>
                                    <span className="text-white/60 ml-1">following</span>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        {isOwnProfile ? (
                            <Button
                                variant="outline"
                                onClick={() => setEditModalOpen(true)}
                                className="gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </Button>
                        ) : (
                            <FollowButton
                                userId={user.id}
                                initialIsFollowing={user.isFollowing}
                                initialFollowerCount={user._count.followers}
                            />
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab("hosted")}
                        className={`px-6 py-3 rounded-full font-medium transition-colors border ${activeTab === "hosted"
                            ? "bg-gold text-black border-gold"
                            : "bg-transparent text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                            }`}
                    >
                        Hosted Experiences ({user._count.hostedExperiences})
                    </button>
                    <button
                        onClick={() => setActiveTab("joined")}
                        className={`px-6 py-3 rounded-full font-medium transition-colors border ${activeTab === "joined"
                            ? "bg-gold text-black border-gold"
                            : "bg-transparent text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                            }`}
                    >
                        Joined Experiences ({user._count.joinedExperiences})
                    </button>
                </div>

                {/* Experiences Grid */}
                {displayExperiences.length === 0 ? (
                    <div className="bg-surface border border-white/10 rounded-2xl p-12 text-center">
                        <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No experiences yet</h3>
                        <p className="text-white/70">
                            {activeTab === "hosted"
                                ? isOwnProfile
                                    ? "Create your first experience!"
                                    : "This user hasn't hosted any experiences yet."
                                : isOwnProfile
                                    ? "Join an experience to get started!"
                                    : "This user hasn't joined any experiences yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayExperiences.map((exp) => (
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

            {/* Modals */}
            <FollowModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                userId={user.id}
                type={modalType}
                initialCount={modalType === "followers" ? user._count.followers : user._count.following}
            />

            <EditProfileModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                user={user}
            />
        </div>
    );
}

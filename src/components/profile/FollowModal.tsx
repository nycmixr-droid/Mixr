"use client";

import { useState, useEffect } from "react";
import { X, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFollowers, getFollowing } from "@/app/profile/[userId]/actions";

type User = {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
};

interface FollowModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    type: "followers" | "following";
    initialCount: number;
}

export function FollowModal({ isOpen, onClose, userId, type, initialCount }: FollowModalProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            const fetchUsers = async () => {
                try {
                    const data = type === "followers"
                        ? await getFollowers(userId)
                        : await getFollowing(userId);
                    setUsers(data);
                } catch (error) {
                    console.error("Failed to fetch users:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUsers();
        }
    }, [isOpen, userId, type]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold font-heading">
                        {type === "followers" ? "Followers" : "Following"}
                        <span className="text-white/50 ml-2">({initialCount})</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
                            <p className="text-white/70">
                                {type === "followers" ? "No followers yet" : "Not following anyone yet"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <Link
                                    key={user.id}
                                    href={`/profile/${user.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold/30 flex-shrink-0">
                                        {user.image ? (
                                            <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gold/20 flex items-center justify-center text-gold text-lg font-bold">
                                                {user.name?.[0] || "?"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{user.name || "Anonymous"}</p>
                                        {user.bio && (
                                            <p className="text-sm text-white/50 truncate">{user.bio}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

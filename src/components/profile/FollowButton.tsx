"use client";

import { useState } from "react";
import { followUser, unfollowUser } from "@/app/profile/[userId]/actions";
import { Button } from "@/components/ui/Button";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
    userId: string;
    initialIsFollowing: boolean;
    initialFollowerCount: number;
}

export function FollowButton({ userId, initialIsFollowing, initialFollowerCount }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followerCount, setFollowerCount] = useState(initialFollowerCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(userId);
                setIsFollowing(false);
                setFollowerCount((prev) => prev - 1);
            } else {
                await followUser(userId);
                setIsFollowing(true);
                setFollowerCount((prev) => prev + 1);
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <Button
                onClick={handleFollow}
                disabled={isLoading}
                variant={isFollowing ? "outline" : "primary"}
                className="gap-2"
            >
                {isFollowing ? (
                    <>
                        <UserMinus className="w-4 h-4" />
                        Unfollow
                    </>
                ) : (
                    <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                    </>
                )}
            </Button>
            <span className="text-sm text-white/70">
                {followerCount} {followerCount === 1 ? "follower" : "followers"}
            </span>
        </div>
    );
}

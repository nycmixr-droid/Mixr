"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const currentUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!currentUser) throw new Error("User not found");

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const gender = formData.get("gender") as string;
    const image = formData.get("image") as string;

    await db.user.update({
        where: { id: currentUser.id },
        data: {
            name,
            bio,
            gender,
            image,
        },
    });

    revalidatePath(`/profile/${currentUser.id}`);
}

export async function getUserProfile(userId: string) {
    const { userId: currentUserId } = await auth();

    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            _count: {
                select: {
                    hostedExperiences: true,
                    joinedExperiences: true,
                    followers: true,
                    following: true,
                },
            },
        },
    });

    if (!user) return null;

    // Check if current user is following this profile
    let isFollowing = false;
    if (currentUserId) {
        const currentUser = await db.user.findUnique({
            where: { clerkId: currentUserId },
        });

        if (currentUser) {
            const follow = await db.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUser.id,
                        followingId: userId,
                    },
                },
            });
            isFollowing = !!follow;
        }
    }

    return { ...user, isFollowing };
}

export async function getHostedExperiences(userId: string) {
    const experiences = await db.event.findMany({
        where: {
            hostId: userId,
            published: true,
        },
        include: {
            _count: {
                select: {
                    participants: true,
                },
            },
        },
        orderBy: {
            date: "desc",
        },
    });

    return experiences;
}

export async function getJoinedExperiences(userId: string) {
    const rsvps = await db.rSVP.findMany({
        where: {
            userId,
            status: "CONFIRMED",
        },
        include: {
            event: {
                include: {
                    host: true,
                    _count: {
                        select: {
                            participants: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return rsvps.map((rsvp) => rsvp.event);
}

export async function followUser(userIdToFollow: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("You must be signed in to follow users");
    }

    const currentUser = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!currentUser) {
        throw new Error("User not found");
    }

    if (currentUser.id === userIdToFollow) {
        throw new Error("You cannot follow yourself");
    }

    await db.follow.create({
        data: {
            followerId: currentUser.id,
            followingId: userIdToFollow,
        },
    });

    revalidatePath(`/profile/${userIdToFollow}`);
    return { success: true };
}

export async function unfollowUser(userIdToUnfollow: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("You must be signed in");
    }

    const currentUser = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!currentUser) {
        throw new Error("User not found");
    }

    await db.follow.deleteMany({
        where: {
            followerId: currentUser.id,
            followingId: userIdToUnfollow,
        },
    });

    revalidatePath(`/profile/${userIdToUnfollow}`);
    return { success: true };
}

export async function getFollowers(userId: string) {
    const followers = await db.follow.findMany({
        where: {
            followingId: userId,
        },
        include: {
            follower: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return followers.map((f) => f.follower);
}

export async function getFollowing(userId: string) {
    const following = await db.follow.findMany({
        where: {
            followerId: userId,
        },
        include: {
            following: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return following.map((f) => f.following);
}

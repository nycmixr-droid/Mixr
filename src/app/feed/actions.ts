"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getLiveFeed() {
    const now = new Date();

    const experiences = await db.event.findMany({
        where: {
            published: true,
            rsvpDeadline: {
                gte: now,
            },
        },
        include: {
            host: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            _count: {
                select: {
                    participants: true,
                },
            },
        },
        orderBy: {
            rsvpDeadline: "asc",
        },
    });

    return experiences;
}

export async function getFollowingFeed() {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const currentUser = await db.user.findUnique({
        where: { clerkId: userId },
        include: {
            following: {
                select: {
                    followingId: true,
                },
            },
        },
    });

    if (!currentUser) {
        return [];
    }

    const followingIds = currentUser.following.map((f) => f.followingId);
    const now = new Date();

    const experiences = await db.event.findMany({
        where: {
            published: true,
            rsvpDeadline: {
                gte: now,
            },
            hostId: {
                in: followingIds,
            },
        },
        include: {
            host: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            _count: {
                select: {
                    participants: true,
                },
            },
        },
        orderBy: {
            rsvpDeadline: "asc",
        },
    });

    return experiences;
}

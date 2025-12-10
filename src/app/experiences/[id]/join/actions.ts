"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function joinExperience(experienceId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("You must be signed in to join");
    }

    const currentUser = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!currentUser) {
        throw new Error("User not found");
    }

    const experience = await db.event.findUnique({
        where: { id: experienceId },
        select: {
            id: true,
            hostId: true,
            rsvpDeadline: true,
            maxParticipants: true,
            _count: {
                select: {
                    participants: true,
                },
            },
        },
    });

    if (!experience) {
        throw new Error("Experience not found");
    }

    // Prevent self-join
    if (experience.hostId === currentUser.id) {
        throw new Error("You cannot join your own experience");
    }

    // Check if deadline has passed
    if (new Date(experience.rsvpDeadline) < new Date()) {
        throw new Error("The deadline to join has passed");
    }

    // Check if already joined
    const existing = await db.rSVP.findUnique({
        where: {
            userId_eventId: {
                userId: currentUser.id,
                eventId: experienceId,
            },
        },
    });

    if (existing) {
        throw new Error("You've already joined this experience");
    }

    // Check capacity
    if (
        experience.maxParticipants &&
        experience._count.participants >= experience.maxParticipants
    ) {
        throw new Error("This experience is full");
    }

    // Create RSVP
    await db.rSVP.create({
        data: {
            userId: currentUser.id,
            eventId: experienceId,
            status: "CONFIRMED",
        },
    });

    revalidatePath("/feed");
    revalidatePath(`/experiences/${experienceId}`);
    revalidatePath("/my-experiences");

    return { success: true };
}

export async function getExperienceDetails(experienceId: string) {
    const { userId } = await auth();

    const experience = await db.event.findUnique({
        where: { id: experienceId },
        include: {
            host: {
                include: {
                    _count: {
                        select: {
                            followers: true,
                        },
                    },
                },
            },
            participants: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    participants: true,
                },
            },
        },
    });

    if (!experience) {
        return null;
    }

    // Check if current user is following the host
    let isFollowing = false;
    if (userId) {
        const currentUser = await db.user.findUnique({
            where: { clerkId: userId },
        });

        if (currentUser) {
            const follow = await db.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUser.id,
                        followingId: experience.host.id,
                    },
                },
            });
            isFollowing = !!follow;
        }
    }

    return {
        ...experience,
        host: {
            ...experience.host,
            isFollowing,
        },
    };
}

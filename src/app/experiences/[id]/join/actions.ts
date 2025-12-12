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
            visibility: true,
            audience: true,

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

    // Check audience
    if (experience.audience !== "ALL") {
        if (!currentUser.gender) {
            // Optional: Prompt user to set gender? For now, maybe allow or block.
            // Let's assume we block if gender is unknown and audience is restricted.
            throw new Error("Please update your profile with your gender to join this experience");
        }
        if (experience.audience === "MEN_ONLY" && currentUser.gender !== "male") {
            throw new Error("This experience is for men only");
        }
        if (experience.audience === "WOMEN_ONLY" && currentUser.gender !== "female") {
            throw new Error("This experience is for women only");
        }
    }

    // Create RSVP
    const status = experience.visibility === "PRIVATE" ? "PENDING" : "CONFIRMED";

    await db.rSVP.create({
        data: {
            userId: currentUser.id,
            eventId: experienceId,
            status,
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

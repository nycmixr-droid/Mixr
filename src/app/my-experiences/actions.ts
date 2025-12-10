"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getMyExperiences() {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const user = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        return [];
    }

    // Get all RSVPs for this user
    const rsvps = await db.rSVP.findMany({
        where: {
            userId: user.id,
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

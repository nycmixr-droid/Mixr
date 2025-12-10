"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getHostStats() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    let user = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        // Auto-create user from Clerk
        const clerkUser = await currentUser();
        user = await db.user.create({
            data: {
                clerkId: userId,
                email: clerkUser?.emailAddresses?.[0]?.emailAddress || `user-${userId}@temp.com`,
                name: clerkUser?.firstName || clerkUser?.username || null,
                image: clerkUser?.imageUrl || null,
            },
        });
    }

    const events = await db.event.findMany({
        where: {
            hostId: user.id,
        },
        include: {
            _count: {
                select: {
                    participants: true,
                },
            },
            participants: {
                include: {
                    user: true,
                },
            },
        },
    });

    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum: number, event) => sum + event._count.participants, 0);

    return {
        totalEvents,
        totalParticipants,
        totalRevenue: 0, // No payments in new model
    };
}

export async function getHostEvents() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    let user = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        // Auto-create user from Clerk
        const clerkUser = await currentUser();
        user = await db.user.create({
            data: {
                clerkId: userId,
                email: clerkUser?.emailAddresses?.[0]?.emailAddress || `user-${userId}@temp.com`,
                name: clerkUser?.firstName || clerkUser?.username || null,
                image: clerkUser?.imageUrl || null,
            },
        });
    }

    const events = await db.event.findMany({
        where: {
            hostId: user.id,
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

    return events;
}

"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getPendingRequests(eventId: string) {
    const { userId } = await auth();
    if (!userId) return [];

    const event = await db.event.findUnique({
        where: { id: eventId },
        select: { hostId: true },
    });

    if (!event) return [];

    const currentUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!currentUser || currentUser.id !== event.hostId) return [];

    const requests = await db.rSVP.findMany({
        where: {
            eventId,
            status: "PENDING",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return requests;
}

export async function updateRequestStatus(rsvpId: string, status: "CONFIRMED" | "CANCELLED") {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const rsvp = await db.rSVP.findUnique({
        where: { id: rsvpId },
        include: { event: true },
    });

    if (!rsvp) throw new Error("Request not found");

    const currentUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!currentUser || currentUser.id !== rsvp.event.hostId) {
        throw new Error("Unauthorized");
    }

    await db.rSVP.update({
        where: { id: rsvpId },
        data: { status },
    });

    revalidatePath(`/events/${rsvp.eventId}`);
}

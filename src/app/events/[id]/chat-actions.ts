"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function sendMessage(eventId: string, content: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error("User not found");

    // Check if user is participant or host
    const event = await db.event.findUnique({
        where: { id: eventId },
        include: { participants: true },
    });

    if (!event) throw new Error("Event not found");

    const isHost = event.hostId === user.id;
    const isParticipant = event.participants.some((p) => p.userId === user.id && p.status === "CONFIRMED");

    if (!isHost && !isParticipant) {
        throw new Error("You must join the event to chat");
    }

    await db.message.create({
        data: {
            content,
            eventId,
            userId: user.id,
        },
    });

    revalidatePath(`/events/${eventId}`);
}

export async function getMessages(eventId: string) {
    const { userId } = await auth();
    if (!userId) return [];

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return [];

    const event = await db.event.findUnique({
        where: { id: eventId },
        include: { participants: true },
    });

    if (!event) return [];

    const isHost = event.hostId === user.id;
    const isParticipant = event.participants.some((p) => p.userId === user.id && p.status === "CONFIRMED");

    if (!isHost && !isParticipant) return [];

    return db.message.findMany({
        where: { eventId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

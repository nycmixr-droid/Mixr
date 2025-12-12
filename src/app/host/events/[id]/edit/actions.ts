"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateEvent(eventId: string, formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Verify the user owns this event
    const event = await db.event.findUnique({
        where: { id: eventId },
    });

    if (!event || event.hostId !== user.id) {
        throw new Error("Unauthorized to edit this event");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string | null;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
    const price = formData.get("price") as string;
    const capacity = formData.get("capacity") as string;
    const image = formData.get("image") as string;

    const dateTime = new Date(`${date}T${time}`);

    await db.event.update({
        where: { id: eventId },
        data: {
            title,
            description,
            category,
            date: dateTime,
            location,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            price: parseFloat(price),
            maxParticipants: capacity ? parseInt(capacity) : null,
            image,
        },
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath("/host/dashboard");
}

export async function getEventForEdit(eventId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const event = await db.event.findUnique({
        where: { id: eventId },
    });

    if (!event || event.hostId !== user.id) {
        throw new Error("Unauthorized to edit this event");
    }

    return event;
}

"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string;
    const location = formData.get("location") as string;
    const priceStr = formData.get("price") as string;
    const capacityStr = formData.get("capacity") as string;
    const image = formData.get("image") as string;

    // Combine date and time
    const dateTime = new Date(`${dateStr}T${timeStr}`);

    // Sync user with our DB
    await db.user.upsert({
        where: { id: user.id },
        update: {
            email: user.emailAddresses[0]?.emailAddress || "",
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Host",
            image: user.imageUrl,
            clerkId: user.id, // Ensure clerkId is updated
        },
        create: {
            id: user.id,
            clerkId: user.id, // Required field
            email: user.emailAddresses[0]?.emailAddress || "",
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Host",
            image: user.imageUrl,
        },
    });

    // Default RSVP deadline to 2 hours before event
    const rsvpDeadline = new Date(dateTime.getTime() - 2 * 60 * 60 * 1000);

    const event = await db.event.create({
        data: {
            title,
            description,
            category,
            date: dateTime,
            rsvpDeadline,
            location,
            price: parseFloat(priceStr) || 0,
            maxParticipants: parseInt(capacityStr) || 0,
            image: image || "https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=1000&auto=format&fit=crop",
            hostId: user.id,
        },
    });

    revalidatePath("/explore");
    redirect(`/events/${event.id}`);
}

export async function getEvents() {
    const events = await db.event.findMany({
        where: {
            published: true,
        },
        orderBy: { date: "asc" },
        include: {
            host: true,
            _count: {
                select: { participants: true },
            },
        },
    });
    return events;
}

export async function getEventById(id: string) {
    const event = await db.event.findUnique({
        where: { id },
        include: {
            host: true,
            _count: {
                select: {
                    participants: true,
                },
            },
        },
    });

    return event;
}

"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createExperience(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("You must be signed in to create plans");
    }

    // Get or create user
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

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string | null;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const deadlineHours = parseInt(formData.get("deadlineHours") as string);
    const location = formData.get("location") as string;
    const locationTBD = formData.get("locationTBD") === "true";
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
    const visibility = (formData.get("visibility") as "PUBLIC" | "PRIVATE") || "PUBLIC";
    const audience = (formData.get("audience") as "ALL" | "MEN_ONLY" | "WOMEN_ONLY") || "ALL";
    const image = formData.get("image") as string;

    const dateTime = new Date(`${date}T${time}`);
    const rsvpDeadline = new Date(dateTime.getTime() - deadlineHours * 60 * 60 * 1000);

    const experience = await db.event.create({
        data: {
            title,
            description,
            category,
            date: dateTime,
            rsvpDeadline,
            location: locationTBD ? "TBD" : (location || "TBD"),
            locationTBD,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            visibility,
            audience,
            image: image || null,
            host: {
                connect: { id: user.id },
            },
            published: true, // Auto-publish
            isInstantJoin: true,
        },
    });

    revalidatePath("/feed");
    return { success: true, experienceId: experience.id };
}

"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getMyTickets() {
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

    const tickets = await db.ticket.findMany({
        where: {
            userId: user.id,
            order: {
                paymentStatus: "COMPLETED",
            },
        },
        include: {
            event: true,
            order: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return tickets;
}

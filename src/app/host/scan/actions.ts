"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function checkInTicket(qrCode: string) {
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

    // Find the ticket
    const ticket = await db.ticket.findUnique({
        where: { qrCode },
        include: {
            event: true,
            user: true,
        },
    });

    if (!ticket) {
        return { success: false, message: "Invalid ticket" };
    }

    // Verify the user is the host of this event
    if (ticket.event.hostId !== user.id) {
        return { success: false, message: "Unauthorized" };
    }

    // Check if already used
    if (ticket.status === "USED") {
        return {
            success: false,
            message: `Ticket already used at ${ticket.checkedInAt?.toLocaleString()}`,
        };
    }

    // Check if cancelled or refunded
    if (ticket.status === "CANCELLED" || ticket.status === "REFUNDED") {
        return { success: false, message: `Ticket is ${ticket.status.toLowerCase()}` };
    }

    // Mark as used
    await db.ticket.update({
        where: { id: ticket.id },
        data: {
            status: "USED",
            checkedInAt: new Date(),
        },
    });

    return {
        success: true,
        message: "Check-in successful",
        attendee: {
            name: ticket.user.name || "Guest",
            email: ticket.user.email,
        },
    };
}

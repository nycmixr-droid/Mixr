"use server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";
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
    revalidatePath(`/events/${experienceId}`);
    revalidatePath("/my-experiences");

    return { success: true };
}

export async function createCheckoutSession(eventId: string) {
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

    if (!event) {
        throw new Error("Event not found");
    }

    // Create pending order
    const order = await db.order.create({
        data: {
            userId: user.id,
            totalAmount: event.price,
            paymentStatus: "PENDING",
        },
    });

    // Generate QR code for the ticket
    const qrCode = randomBytes(16).toString("hex");

    // Create pending ticket
    const ticket = await db.ticket.create({
        data: {
            userId: user.id,
            eventId: event.id,
            orderId: order.id,
            qrCode,
            status: "VALID",
        },
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: event.title,
                        description: event.description,
                        images: event.image ? [event.image] : [],
                    },
                    unit_amount: Math.round(event.price * 100), // Convert to cents
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}`,
        metadata: {
            orderId: order.id,
            ticketId: ticket.id,
            eventId: event.id,
            userId: user.id,
        },
    });

    // Update order with payment intent ID
    await db.order.update({
        where: { id: order.id },
        data: {
            paymentIntentId: session.id,
        },
    });

    return { sessionId: session.id, url: session.url };
}

export async function confirmPayment(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
        const orderId = session.metadata?.orderId;

        if (orderId) {
            await db.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: "COMPLETED",
                },
            });

            return { success: true };
        }
    }

    return { success: false };
}

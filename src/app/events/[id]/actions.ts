"use server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";

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

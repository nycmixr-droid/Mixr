"use server";

import { db } from "@/lib/db";

export async function getFeaturedEvent() {
    const featuredEvent = await db.event.findFirst({
        where: {
            isFeatured: true,
            published: true,
        },
        include: {
            host: true,
            _count: {
                select: {
                    participants: true,
                },
            },
        },
    });

    return featuredEvent;
}

export async function getUpcomingEvents() {
    const events = await db.event.findMany({
        where: {
            published: true,
            date: {
                gte: new Date(),
            },
        },
        include: {
            host: true,
            _count: {
                select: {
                    participants: true,
                },
            },
        },
        orderBy: {
            date: "asc",
        },
        take: 6,
    });

    return events;
}

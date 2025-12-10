import { db } from "@/lib/db";
import BookEventClient from "./BookEventClient";
import { notFound } from "next/navigation";

export default async function BookEventPage({ params }: { params: { id: string } }) {
    const event = await db.event.findUnique({
        where: { id: params.id },
    });

    if (!event) {
        notFound();
    }

    return <BookEventClient event={event} />;
}

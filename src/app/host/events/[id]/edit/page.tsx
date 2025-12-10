import { getEventForEdit } from "./actions";
import EventEditClient from "./EventEditClient";
import { notFound } from "next/navigation";

export default async function EventEditPage({ params }: { params: { id: string } }) {
    try {
        const event = await getEventForEdit(params.id);
        return <EventEditClient event={event} />;
    } catch (error) {
        notFound();
    }
}

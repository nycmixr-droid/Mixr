import { getMyTickets } from "./actions";
import MyTicketsClient from "./MyTicketsClient";

export default async function MyTicketsPage() {
    const tickets = await getMyTickets();
    return <MyTicketsClient tickets={tickets} />;
}

import { Navbar } from "@/components/landing/Navbar";
import { getHostStats, getHostEvents } from "../actions";
import HostDashboardClient from "./HostDashboardClient";

export default async function HostDashboard() {
    const stats = await getHostStats();
    const events = await getHostEvents();

    return (
        <>
            <Navbar />
            <HostDashboardClient stats={stats} events={events} />
        </>
    );
}

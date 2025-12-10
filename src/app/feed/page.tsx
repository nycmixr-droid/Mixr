import { Navbar } from "@/components/landing/Navbar";
import { getLiveFeed } from "./actions";
import FeedClient from "./FeedClient";

export default async function FeedPage() {
    const experiences = await getLiveFeed();
    return (
        <>
            <Navbar />
            <FeedClient experiences={experiences} />
        </>
    );
}

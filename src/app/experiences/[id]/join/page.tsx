import { Navbar } from "@/components/landing/Navbar";
import { getExperienceDetails } from "./actions";
import JoinExperienceClient from "./JoinExperienceClient";
import { notFound } from "next/navigation";

export default async function JoinExperiencePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const experience = await getExperienceDetails(id);

    if (!experience) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <JoinExperienceClient experience={experience} />
        </>
    );
}

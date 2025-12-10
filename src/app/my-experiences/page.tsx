import { Navbar } from "@/components/landing/Navbar";
import { getMyExperiences } from "./actions";
import MyExperiencesClient from "./MyExperiencesClient";

export default async function MyExperiencesPage() {
    const experiences = await getMyExperiences();

    return (
        <>
            <Navbar />
            <MyExperiencesClient experiences={experiences} />
        </>
    );
}

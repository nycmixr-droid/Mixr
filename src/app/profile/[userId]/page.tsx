import { Navbar } from "@/components/landing/Navbar";
import { getUserProfile, getHostedExperiences, getJoinedExperiences } from "./actions";
import ProfileClient from "./ProfileClient";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const user = await getUserProfile(userId);

    if (!user) {
        notFound();
    }

    const hostedExperiences = await getHostedExperiences(userId);
    const joinedExperiences = await getJoinedExperiences(userId);

    // Check if this is the current user's own profile
    const { userId: clerkId } = await auth();
    let isOwnProfile = false;
    if (clerkId) {
        const currentUser = await db.user.findUnique({
            where: { clerkId },
        });
        isOwnProfile = currentUser?.id === userId;
    }

    return (
        <>
            <Navbar />
            <ProfileClient
                user={user}
                hostedExperiences={hostedExperiences}
                joinedExperiences={joinedExperiences}
                isOwnProfile={isOwnProfile}
            />
        </>
    );
}

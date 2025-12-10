import { Navbar } from "@/components/landing/Navbar";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function MyProfilePage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    const user = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user) {
        redirect("/");
    }

    // Redirect to the user's actual profile page
    redirect(`/profile/${user.id}`);
}
